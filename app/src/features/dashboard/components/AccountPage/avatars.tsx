import React from 'react';

const s = (paths: React.ReactNode) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    {paths}
  </svg>
);
const c = (cx: number, cy: number, r: number) => <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="2"/>;
const p = (d: string, w = 2) => <path d={d} stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>;
const body = "M9 44c0-8.284 6.716-15 15-15s15 6.716 15 15";

export const AVATARS: { label: string; svg: React.ReactNode }[] = [
  // 1 Classic Man
  { label: 'Classic Man', svg: s(<>{c(24,17,9)}{p(body)}</>) },
  // 2 Woman long hair
  { label: 'Woman', svg: s(<>{c(24,16,8)}{p("M16 16c-1 5-2 10 0 14M32 16c1 5 2 10 0 14",1.5)}{p("M10 43c0-8 6.268-14 14-14s14 6 14 14")}</>) },
  // 3 Developer glasses
  { label: 'Developer', svg: s(<>{c(24,16,9)}<rect x="17" y="13" width="6" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="25" y="13" width="6" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p("M23 15h2M15 15h2M31 15h2",1.5)}{p(body)}{p("M17 37l-3 3 3 3M31 37l3 3-3 3",1.5)}</>) },
  // 4 Bun Woman
  { label: 'Bun Woman', svg: s(<>{c(24,18,8)}{c(24,7,4)}{p(body)}</>) },
  // 5 Bearded Man
  { label: 'Bearded Man', svg: s(<>{c(24,16,9)}{p("M15 20c0 6 2 9 9 9s9-3 9-9")}{p("M15 23c2 2 3 4 9 4s7-2 9-4",1.5)}{p(body)}</>) },
  // 6 Cap Guy
  { label: 'Cap Guy', svg: s(<>{c(24,18,8)}{p("M15 16c0-5 2-9 9-9s9 4 9 9")}{p("M14 16h20",2)}{p("M33 16l4-1",2)}{p(body)}</>) },
  // 7 Curly Woman
  { label: 'Curly Woman', svg: s(<>{c(24,18,8)}{p("M16 14c-1-5 1-8 4-8M20 8c1-3 3-4 4-3M24 7c2-2 4-1 5 1M29 10c2 0 4 2 3 4M14 18c-2 0-3 2-2 4",2)}{p(body)}</>) },
  // 8 Hoodie Dev
  { label: 'Hoodie Dev', svg: s(<>{c(24,16,8)}{p("M16 24c-7 2-7 8-7 20M32 24c7 2 7 8 7 20")}{p("M16 24c2-2 4-3 8-3s6 1 8 3")}{p("M20 24l-2 6h12l-2-6",1.5)}</>) },
  // 9 Headphones
  { label: 'Headphones', svg: s(<>{c(24,18,8)}{p("M14 16a10 10 0 0 1 20 0")}<rect x="12" y="16" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="32" y="16" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p(body)}</>) },
  // 10 Ninja
  { label: 'Ninja', svg: s(<>{c(24,16,9)}{p("M15 16h18")}{p("M15 20c2 4 16 4 18 0",1.5)}<circle cx="20" cy="14" r="1.5" fill="currentColor"/><circle cx="28" cy="14" r="1.5" fill="currentColor"/>{p(body)}</>) },
  // 11 Astronaut
  { label: 'Astronaut', svg: s(<>{c(24,17,10)}<rect x="18" y="11" width="12" height="12" rx="6" stroke="currentColor" strokeWidth="1.5"/>{p("M21 17h6",1.5)}{p("M14 27c-5 2-5 8-5 17M34 27c5 2 5 8 5 17")}{p("M14 27c2-2 5-4 10-4s8 2 10 4")}</>) },
  // 12 Chef
  { label: 'Chef', svg: s(<>{c(24,20,8)}{p("M17 18c0-7 2-12 7-12s7 5 7 12")}{p("M15 14c-3 0-5 2-5 5s2 5 5 5M33 14c3 0 5 2 5 5s-2 5-5 5")}{p("M14 20h20",2)}{p(body)}</>) },
  // 13 Graduate
  { label: 'Graduate', svg: s(<>{c(24,19,8)}{p("M14 15l10-6 10 6-10 6z")}{p("M34 15v8")}{p("M34 23c0 2-1 3-2 3",1.5)}{p(body)}</>) },
  // 14 Scientist
  { label: 'Scientist', svg: s(<>{c(24,16,8)}<rect x="19" y="13" width="4" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="25" y="13" width="4" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>{p("M23 15h2",1.5)}{p(body)}{p("M20 32l-2 6h4l1-4M28 32l2 6h-4l-1-4",1.5)}</>) },
  // 15 Artist Beret
  { label: 'Artist', svg: s(<>{c(24,18,8)}{p("M15 15c0-6 2-9 9-9s9 3 9 9")}{p("M15 13c3-4 15-4 18 0",1.5)}{p("M31 10c2-1 4 0 4 2",1.5)}{p(body)}</>) },
  // 16 Superhero
  { label: 'Superhero', svg: s(<>{c(24,15,8)}{p("M17 12c1-5 13-5 14 0",1.5)}{p("M16 23c-7 4-9 14-9 21")}{p("M32 23c7 4 9 14 9 21")}{p("M16 23c2-2 4-3 8-3s6 1 8 3")}{p("M20 30l-4 14M28 30l4 14",1.5)}</>) },
  // 17 Robot
  { label: 'Robot', svg: s(<><rect x="14" y="10" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/><rect x="18" y="14" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="25" y="14" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/>{p("M22 21h4",2)}{p("M24 10V7M20 7h8",1.5)}{p("M8 44c0-8 7-15 16-15s16 7 16 15")}</>) },
  // 18 Pirate
  { label: 'Pirate', svg: s(<>{c(24,18,8)}{p("M15 15c0-6 3-9 9-9s9 3 9 9")}{p("M14 13h7v5a3 3 0 0 1-6 0v-3",1.5)}{p("M24 15l2-2",1.5)}{p(body)}</>) },
  // 19 Viking
  { label: 'Viking', svg: s(<>{c(24,19,8)}{p("M16 16c0-7 2-11 8-11s8 4 8 11")}{p("M14 13c-3-1-5 1-5 4M34 13c3-1 5 1 5 4")}{p("M14 16h-4M34 16h4",2)}{p(body)}</>) },
  // 20 Cowboy
  { label: 'Cowboy', svg: s(<>{c(24,19,8)}{p("M16 16c0-6 2-9 8-9s8 3 8 9")}{p("M11 16h26",2)}{p("M13 16c0-2 2-4 11-4s11 2 11 4",1.5)}{p(body)}</>) },
  // 21 Princess Crown
  { label: 'Princess', svg: s(<>{c(24,19,8)}{p("M16 13l4-6 4 4 4-4 4 6")}{p("M15 13h18",2)}{p(body)}</>) },
  // 22 Doctor
  { label: 'Doctor', svg: s(<>{c(24,16,8)}{p("M20 24c0 4-2 6-2 6M28 24c0 4 2 6 2 6")}{p("M18 30c0 3 3 4 6 4s6-1 6-4",1.5)}{p("M21 30h6",1.5)}{p(body)}</>) },
  // 23 Wizard
  { label: 'Wizard', svg: s(<>{c(24,20,8)}{p("M14 17L24 3l10 14")}{p("M14 17h20",1.5)}{p(body)}{p("M30 8l2-2M32 12l2 0M30 5l1-3",1.5)}</>) },
  // 24 Tie Person
  { label: 'Business', svg: s(<>{c(24,16,8)}{p("M21 24l3 4 3-4")}{p("M21 28l-1 12M27 28l1 12",1.5)}{p("M9 44c0-8 6.716-15 15-15s15 7 15 15")}</>) },
  // 25 Punk Mohawk
  { label: 'Punk', svg: s(<>{c(24,19,8)}{p("M21 6V3M24 5V2M27 6V3",2)}{p("M19 11c1-6 10-6 11 0",1.5)}{p(body)}</>) },
  // 26 Nerd Bowtie
  { label: 'Nerd', svg: s(<><rect x="17" y="13" width="5" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="26" y="13" width="5" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p("M22 15h4",1.5)}{c(24,17,8)}{p("M21 25l-3 2 3 2M27 25l3 2-3 2",1.5)}{p("M21 27h6",1.5)}{p(body)}</>) },
  // 27 Alien
  { label: 'Alien', svg: s(<><ellipse cx="24" cy="17" rx="10" ry="12" stroke="currentColor" strokeWidth="2"/><ellipse cx="20" cy="15" rx="3" ry="4" stroke="currentColor" strokeWidth="1.5"/><ellipse cx="28" cy="15" rx="3" ry="4" stroke="currentColor" strokeWidth="1.5"/>{p("M18 22c2 2 8 2 10 0",1.5)}{p("M10 38c0-6 6.268-9 14-9s14 3 14 9")}</>) },
  // 28 Cat Ears
  { label: 'Cat', svg: s(<>{c(24,18,8)}{p("M15 13l-3-5 5 3M33 13l3-5-5 3",2)}{p("M21 21c1 2 5 2 6 0",1.5)}{p(body)}</>) },
  // 29 Angel Halo
  { label: 'Angel', svg: s(<>{c(24,18,8)}<ellipse cx="24" cy="8" rx="7" ry="2.5" stroke="currentColor" strokeWidth="1.5"/>{p(body)}{p("M16 28c-2 4-4 10-5 16M32 28c2 4 4 10 5 16",1.5)}{p("M16 28c3 6 18 6 22 0",1.5)}</>) },
  // 30 Horns Devil
  { label: 'Devil', svg: s(<>{c(24,18,8)}{p("M16 13l-3-6 3 3M32 13l3-6-3 3",2)}{p("M21 22c1 2 5 2 6 0",1.5)}{p(body)}{p("M34 44c0-2-2-5-6-8",1.5)}</>) },
  // 31 Samurai topknot
  { label: 'Samurai', svg: s(<>{c(24,18,8)}{p("M21 10V5M24 9V4M27 10V5",2)}{p("M18 10c1-3 12-3 13 0",1.5)}{p("M13 26l-5 18M35 26l5 18")}{p("M13 26c2-2 5-3 11-3s9 1 11 3")}</>) },
  // 32 Astronomer telescope
  { label: 'Stargazer', svg: s(<>{c(24,15,8)}{p(body)}{p("M32 32l6 8M32 32l-3-2",2)}{p("M32 32c-2-2-5-2-6 0",1.5)}</>) },
  // 33 Hacker hoodie + mask
  { label: 'Hacker', svg: s(<>{c(24,16,9)}{p("M15 16h18",2)}{p("M16 12c0-6 2-9 8-9s8 3 8 9")}{p("M9 44c0-8 7-14 15-14s15 6 15 14")}{p("M19 37v5M29 37v5",1.5)}</>) },
  // 34 Teacher glasses book
  { label: 'Teacher', svg: s(<>{c(24,15,8)}<rect x="18" y="12" width="4" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="26" y="12" width="4" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p("M22 14h4",1.5)}{p(body)}<rect x="18" y="28" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>{p("M21 31h6M21 34h4",1.5)}</>) },
  // 35 Gamer headset
  { label: 'Gamer', svg: s(<>{c(24,17,8)}{p("M14 14a10 10 0 0 1 20 0")}<rect x="12" y="14" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="32" y="14" width="4" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p("M34 22l2 3",1.5)}{p(body)}</>) },
  // 36 Traveler backpack
  { label: 'Traveler', svg: s(<>{c(24,14,8)}{p("M18 22v12M30 22v12")}{p("M18 22c1-1 3-2 6-2s5 1 6 2")}<rect x="20" y="22" width="8" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p("M18 34c-4 1-6 4-6 10M30 34c4 1 6 4 6 10")}</>) },
  // 37 Musician notes
  { label: 'Musician', svg: s(<>{c(24,16,8)}{p("M30 6v8l4-2v-8z",1.5)}{p("M30 14c0 2-2 3-2 3",1.5)}{p(body)}</>) },
  // 38 Glasses + ponytail
  { label: 'Ponytail', svg: s(<>{c(24,17,8)}<rect x="18" y="14" width="5" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="25" y="14" width="5" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>{p("M32 17c3 1 4 3 3 5",1.5)}{p("M33 9c2 5 3 14 1 21",1.5)}{p(body)}</>) },
  // 39 Fox ears
  { label: 'Fox', svg: s(<>{c(24,18,8)}{p("M16 13l-2-7 5 4M32 13l2-7-5 4",2)}{p("M21 22c1 1 5 1 6 0",1.5)}{p(body)}</>) },
  // 40 Knight helmet
  { label: 'Knight', svg: s(<><rect x="14" y="10" width="20" height="18" rx="4" stroke="currentColor" strokeWidth="2"/>{p("M14 20h20",2)}{p("M20 20v8M24 20v8",1.5)}{p("M8 44c0-8 7-15 16-15s16 7 16 15")}</>) },
];
