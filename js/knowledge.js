export const KNOWLEDGE = {
  "css grid": {
    title: "CSS Grid",
    category: "Layout module",
    icon: "▦",
    desc: "A two-dimensional CSS layout system that lets you arrange elements into rows and columns without extra markup or floats.",
    facts: [
      ["Introduced", "2017 (CSS3)"],
      ["Browser support", "97%+ global"],
      ["Related", "Flexbox, Subgrid"],
      ["Spec status", "W3C Candidate Rec"],
    ],
    links: ["grid-template", "fr unit", "subgrid"],
  },
  scysearch: {
    title: "ScySearch",
    category: "Developer search engine",
    icon: "S",
    desc: "A meta-search tool that aggregates Stack Overflow, GitHub, and MDN into one ranked result set, part of the Scybud studio.",
    facts: [
      ["Built by", "Abdulroqib"],
      ["Sources", "Stack Overflow, GitHub, MDN"],
      ["Stack", "Vanilla JS + Supabase Edge Functions"],
    ],
    links: ["scybud.com", "GitHub"],
  },
};

export function getKnowledgePanel(query) {
  return KNOWLEDGE[query.toLowerCase().trim()] || null;
}
