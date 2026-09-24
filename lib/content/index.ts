// Content access layer. Pages read content only through these functions.
// They are async so the local data can later be swapped for Supabase
// queries without changing the pages that call them.

import { aboutContent } from "./about";
import { projects, projectsPage } from "./projects";
import {
  publications,
  publicationsPage,
  publicationsProfile,
} from "./publications";
import { researchItems, researchPage } from "./research";
import { contactContent, homeContent, siteSettings } from "./site";

export type * from "./types";

export async function getSiteSettings() {
  return siteSettings;
}

export async function getHomeContent() {
  return homeContent;
}

export async function getAboutContent() {
  return aboutContent;
}

export async function getResearchContent() {
  return { page: researchPage, items: researchItems };
}

export async function getProjectsContent() {
  return { page: projectsPage, items: projects };
}

export async function getPublicationsContent() {
  return {
    page: publicationsPage,
    profile: publicationsProfile,
    items: publications,
  };
}

export async function getContactContent() {
  return contactContent;
}

/** Formats a zero-based list position as a display label, e.g. 0 -> "01". */
export function displayNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}
