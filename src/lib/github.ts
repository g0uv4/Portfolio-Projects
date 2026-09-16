import { createServerFn } from "@tanstack/react-start";
import { profile } from "@/content/profile";
import { works } from "@/content/works";

export type GithubRepo = {
  id: number;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  pushedAt: string;
  isPrivate: boolean;
  isFork: boolean;
  topics: string[];
};

export type GithubProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
};

export type GithubSnapshot = {
  fetchedAt: string;
  ok: boolean;
  error?: string;
  profile: GithubProfile | null;
  publicRepos: GithubRepo[];
  tokenScoped: boolean;
};

type RawRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  pushed_at: string;
  private: boolean;
  fork: boolean;
  topics?: string[];
};

type RawUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

const CACHE_MS = 10 * 60 * 1000;
let cache: { at: number; data: GithubSnapshot } | null = null;

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "zoland-works-archive",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function mapRepo(raw: RawRepo): GithubRepo {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    url: raw.html_url,
    description: raw.description,
    language: raw.language,
    stars: raw.stargazers_count,
    updatedAt: raw.updated_at,
    pushedAt: raw.pushed_at,
    isPrivate: raw.private,
    isFork: raw.fork,
    topics: raw.topics ?? [],
  };
}

async function loadSnapshot(): Promise<GithubSnapshot> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.data;

  const tokenScoped = Boolean(process.env.GITHUB_TOKEN);
  const user = profile.githubUser;

  try {
    const userRes = await fetch(`https://api.github.com/users/${user}`, {
      headers: headers(),
    });
    if (!userRes.ok) {
      throw new Error(`GitHub profile ${userRes.status}`);
    }
    const rawUser = (await userRes.json()) as RawUser;

    const repoPath = tokenScoped
      ? `https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner`
      : `https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`;

    const repoRes = await fetch(repoPath, { headers: headers() });
    if (!repoRes.ok) {
      throw new Error(`GitHub repos ${repoRes.status}`);
    }
    const rawRepos = (await repoRes.json()) as RawRepo[];

    const data: GithubSnapshot = {
      fetchedAt: new Date().toISOString(),
      ok: true,
      tokenScoped,
      profile: {
        login: rawUser.login,
        name: rawUser.name,
        bio: rawUser.bio,
        avatarUrl: rawUser.avatar_url,
        htmlUrl: rawUser.html_url,
        publicRepos: rawUser.public_repos,
        followers: rawUser.followers,
        following: rawUser.following,
      },
      publicRepos: rawRepos
        .filter((repo) => !repo.fork)
        .map(mapRepo)
        .filter((repo) => repo.fullName.toLowerCase().startsWith(`${user.toLowerCase()}/`)),
    };

    cache = { at: now, data };
    return data;
  } catch (error) {
    const failed: GithubSnapshot = {
      fetchedAt: new Date().toISOString(),
      ok: false,
      tokenScoped,
      error: error instanceof Error ? error.message : "GitHub 讀取失敗",
      profile: null,
      publicRepos: [],
    };
    return failed;
  }
}

export const fetchGithubSnapshot = createServerFn({ method: "GET" }).handler(
  async () => loadSnapshot(),
);

export type CatalogRepo = {
  workSlug?: string;
  title: string;
  description: string;
  repo: string;
  url: string;
  visibility: "public" | "private";
  language: string | null;
  stars: number;
  updatedAt: string | null;
  live: boolean;
};

export function mergeCatalog(snapshot: GithubSnapshot): CatalogRepo[] {
  const liveByKey = new Map(
    snapshot.publicRepos.map((repo) => [repo.fullName.toLowerCase(), repo]),
  );

  const fromWorks: CatalogRepo[] = works
    .filter((work) => work.github)
    .map((work) => {
      const gh = work.github!;
      const key = `${gh.owner}/${gh.repo}`.toLowerCase();
      const live = liveByKey.get(key);
      return {
        workSlug: work.slug,
        title: work.title,
        description: work.summary,
        repo: `${gh.owner}/${gh.repo}`,
        url: live?.url ?? `https://github.com/${gh.owner}/${gh.repo}`,
        visibility: live ? (live.isPrivate ? "private" : "public") : gh.visibility,
        language: live?.language ?? work.stack[0] ?? null,
        stars: live?.stars ?? 0,
        updatedAt: live?.pushedAt ?? null,
        live: Boolean(live),
      };
    });

  return fromWorks.sort((a, b) => {
    const score = (item: CatalogRepo) =>
      (item.live && item.visibility === "public" ? 8 : 0) +
      (item.live ? 4 : 0) +
      (item.workSlug ? 2 : 0) +
      (item.visibility === "public" ? 1 : 0);
    return score(b) - score(a);
  });
}
