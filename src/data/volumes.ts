export interface Volume {
  number: string;
  title: string;
  subtitle: string;
  tension: string;
  slug: string;
  manifesto: string;
  chapters: Chapter[];
}

export interface Chapter {
  title: string;
  tagline: string;
  narrativeArc: string;
  dropLogic: string;
  timestamp: string;
  status: "published" | "upcoming" | "out-of-print";
  slug: string;
}

import type { IssueStatus } from "@/types/issue-status";

export interface Issue {
  id: string;
  title: string;
  story: string;
  fabricNotes: string;
  craftsmanship: string;
  edition: string;
  material: string;
  status: IssueStatus;
  price: number;
  images: string[];
  chapterSlug: string;
}

export const volumes: Volume[] = [
  {
    number: "I",
    title: "Dominion",
    subtitle: "The first tension between power and surrender.",
    tension: "Alpha and Omega",
    slug: "dominion",
    manifesto: "In the beginning, there was only hunger and the awareness of being hunted. Dominion explores the primal contract between those who lead and those who follow—not as hierarchy, but as dance. Every garment in this volume carries the weight of authority or the grace of submission, often both in the same thread.",
    chapters: [
      {
        title: "The Alpha Principle",
        tagline: "To lead is to carry the weight of decision.",
        narrativeArc: "This chapter examines the garments worn by those who step forward first—not from ego, but from necessity. Each piece is designed for shoulders that bear responsibility.",
        dropLogic: "Limited to 100 numbered pieces. First access to archival collectors.",
        timestamp: "Published Spring 2024",
        status: "published",
        slug: "alpha-principle"
      },
      {
        title: "The Omega Rest",
        tagline: "There is power in choosing to follow.",
        narrativeArc: "The omega is not weak. The omega is strategic patience embodied. This chapter celebrates garments that whisper rather than shout.",
        dropLogic: "Open edition for 7 days only.",
        timestamp: "Published Summer 2024",
        status: "published",
        slug: "omega-rest"
      }
    ]
  },
  {
    number: "II",
    title: "Appetite",
    subtitle: "What we consume, and what consumes us.",
    tension: "Hungry Wolf and Shear Elegance",
    slug: "appetite",
    manifesto: "Appetite is the study of desire without apology. The hungry wolf does not ask permission to hunt. The sheared sheep transforms vulnerability into refined beauty. This volume lives in the tension between raw wanting and cultivated restraint.",
    chapters: [
      {
        title: "The Hunt",
        tagline: "Desire, unmasked.",
        narrativeArc: "Raw, unapologetic pieces designed for those who pursue what they want without hesitation. Dark fabrications, aggressive silhouettes, predatory details.",
        dropLogic: "Flash drop. 24 hours. No restocks.",
        timestamp: "Published Autumn 2024",
        status: "published",
        slug: "the-hunt"
      },
      {
        title: "After Shearing",
        tagline: "Vulnerability as armor.",
        narrativeArc: "What remains after you've given everything away? This chapter explores garments of elegant minimalism—the beauty of having nothing left to lose.",
        dropLogic: "Pre-order opens January 2025.",
        timestamp: "Upcoming Winter 2025",
        status: "upcoming",
        slug: "after-shearing"
      }
    ]
  },
  {
    number: "III",
    title: "Nocturne",
    subtitle: "The hours between dusk and dawn.",
    tension: "Lone Wolf and Lost Sheep",
    slug: "nocturne",
    manifesto: "Night belongs to those who wander—by choice or by fate. The lone wolf moves through darkness with purpose. The lost sheep seeks a path that may never appear. Nocturne is our meditation on solitude, on the garments we wear when no one else is watching.",
    chapters: [
      {
        title: "Solitary Passage",
        tagline: "The journey taken alone.",
        narrativeArc: "Nightwear reimagined. Pieces for the insomniac, the wanderer, the one who finds peace only in empty streets at 3am.",
        dropLogic: "Monthly subscription box. Members only.",
        timestamp: "Published Winter 2024",
        status: "published",
        slug: "solitary-passage"
      }
    ]
  },
  {
    number: "IV",
    title: "Masquerade",
    subtitle: "The faces we wear to survive.",
    tension: "Cry Wolf and Black Sheep",
    slug: "masquerade",
    manifesto: "Society demands masks. The one who cries wolf learns that truth is rarely believed. The black sheep discovers that standing apart is both curse and gift. Masquerade explores the garments of performance—what we wear to hide, to reveal, to survive.",
    chapters: [
      {
        title: "False Alarms",
        tagline: "When truth sounds like lies.",
        narrativeArc: "Statement pieces that challenge perception. Garments that look one way from afar, reveal their true nature only upon close inspection.",
        dropLogic: "Blind box release. Contents unknown until delivery.",
        timestamp: "Published Spring 2024",
        status: "out-of-print",
        slug: "false-alarms"
      }
    ]
  },
  {
    number: "V",
    title: "Allegiance",
    subtitle: "The bonds we choose and those chosen for us.",
    tension: "Pack and Mob",
    slug: "allegiance",
    manifesto: "The pack moves as one organism—each member essential, none expendable. The mob is chaos with a direction. Allegiance examines belonging: its comforts, its demands, its dangers. These are garments for gatherings, for movements, for standing together.",
    chapters: [
      {
        title: "Formation",
        tagline: "Strength in configuration.",
        narrativeArc: "Modular garments designed to work together. When two or more collectors wear pieces from this chapter simultaneously, new patterns emerge.",
        dropLogic: "Group purchase incentives. Larger groups unlock exclusive colorways.",
        timestamp: "Upcoming Spring 2025",
        status: "upcoming",
        slug: "formation"
      }
    ]
  },
  {
    number: "VI",
    title: "Ragnarök",
    subtitle: "The end that makes way for beginning.",
    tension: "Fenrir and Golden Fleece",
    slug: "ragnarok",
    manifesto: "All things end. Fenrir breaks his chains. The Golden Fleece—that impossible treasure—proves both real and perishable. Ragnarök is our apocalypse collection: garments designed to outlast their wearers, to become relics, to witness the next world.",
    chapters: [
      {
        title: "The Binding Breaks",
        tagline: "What was held finally releases.",
        narrativeArc: "Our most ambitious construction to date. Garments with planned obsolescence points—designed to age, tear, and transform over years of wear into something new.",
        dropLogic: "Auction only. Highest bidders receive pieces with personal mythology attached.",
        timestamp: "Archive Date TBD",
        status: "upcoming",
        slug: "binding-breaks"
      }
    ]
  }
];
