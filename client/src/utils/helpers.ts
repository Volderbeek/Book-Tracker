export const formatDate = (isoString?: string): string => {
  if (!isoString) return 'Not started';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Comprehensive list of standard valid genres
export const VALID_GENRES = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction / Sci-Fi",
  "Fantasy",
  "Mystery / Detective",
  "Thriller / Suspense",
  "Horror",
  "Romance",
  "Historical Fiction",
  "History",
  "Biography / Memoir",
  "Self-Help / Personal Growth",
  "Business / Finance",
  "Science / Technology",
  "Philosophy / Psychology",
  "Poetry",
  "Drama / Plays",
  "Adventure / Action",
  "Classics",
  "Young Adult (YA)",
  "Children's",
  "Humor / Comedy",
  "Graphic Novel / Manga",
  "Spirituality / Religion",
  "Art / Design / Music",
  "Cookbooks / Food"
];

// Helper to clean up Open Library subjects and extract all matching genres
export const getValidGenresFromSubjects = (subjects: string[]): string[] => {
  if (!subjects || subjects.length === 0) return ['Fiction'];
  
  const matched = new Set<string>();
  
  for (const s of subjects) {
    const cleanSubject = s.toLowerCase().trim();
    
    // Check direct matching or keyword matching
    if (cleanSubject.includes('science fiction') || cleanSubject.includes('sci-fi') || cleanSubject.includes('speculative fiction')) {
      matched.add('Science Fiction / Sci-Fi');
    }
    if (cleanSubject.includes('fantasy') || cleanSubject.includes('magic') || cleanSubject.includes('mythology')) {
      matched.add('Fantasy');
    }
    if (cleanSubject.includes('mystery') || cleanSubject.includes('detective') || cleanSubject.includes('crime') || cleanSubject.includes('murder')) {
      matched.add('Mystery / Detective');
    }
    if (cleanSubject.includes('thriller') || cleanSubject.includes('suspense') || cleanSubject.includes('espionage')) {
      matched.add('Thriller / Suspense');
    }
    if (cleanSubject.includes('horror') || cleanSubject.includes('gothic') || cleanSubject.includes('supernatural')) {
      matched.add('Horror');
    }
    if (cleanSubject.includes('romance') || cleanSubject.includes('love story')) {
      matched.add('Romance');
    }
    if (cleanSubject.includes('historical fiction')) {
      matched.add('Historical Fiction');
    }
    if (cleanSubject.includes('history') || cleanSubject.includes('historical') || cleanSubject.includes('archaeology')) {
      matched.add('History');
    }
    if (cleanSubject.includes('biography') || cleanSubject.includes('autobiography') || cleanSubject.includes('memoir') || cleanSubject.includes('diaries')) {
      matched.add('Biography / Memoir');
    }
    if (cleanSubject.includes('self-help') || cleanSubject.includes('motivation') || cleanSubject.includes('personal growth') || cleanSubject.includes('success')) {
      matched.add('Self-Help / Personal Growth');
    }
    if (cleanSubject.includes('business') || cleanSubject.includes('finance') || cleanSubject.includes('economics') || cleanSubject.includes('investing')) {
      matched.add('Business / Finance');
    }
    if (cleanSubject.includes('science') || cleanSubject.includes('technology') || cleanSubject.includes('computers') || cleanSubject.includes('physics') || cleanSubject.includes('mathematics')) {
      matched.add('Science / Technology');
    }
    if (cleanSubject.includes('philosophy') || cleanSubject.includes('psychology') || cleanSubject.includes('ethics') || cleanSubject.includes('logic')) {
      matched.add('Philosophy / Psychology');
    }
    if (cleanSubject.includes('poetry') || cleanSubject.includes('poems')) {
      matched.add('Poetry');
    }
    if (cleanSubject.includes('drama') || cleanSubject.includes('plays') || cleanSubject.includes('theater')) {
      matched.add('Drama / Plays');
    }
    if (cleanSubject.includes('adventure') || cleanSubject.includes('action') || cleanSubject.includes('survival')) {
      matched.add('Adventure / Action');
    }
    if (cleanSubject.includes('classics') || cleanSubject.includes('classic')) {
      matched.add('Classics');
    }
    if (cleanSubject.includes('young adult') || cleanSubject.includes('ya ') || cleanSubject.includes('teenage')) {
      matched.add('Young Adult (YA)');
    }
    if (cleanSubject.includes('children') || cleanSubject.includes('juvenile') || cleanSubject.includes('fairy tales')) {
      matched.add("Children's");
    }
    if (cleanSubject.includes('humor') || cleanSubject.includes('comedy') || cleanSubject.includes('satire') || cleanSubject.includes('wit')) {
      matched.add('Humor / Comedy');
    }
    if (cleanSubject.includes('graphic novel') || cleanSubject.includes('manga') || cleanSubject.includes('comics') || cleanSubject.includes('comic')) {
      matched.add('Graphic Novel / Manga');
    }
    if (cleanSubject.includes('spirituality') || cleanSubject.includes('religion') || cleanSubject.includes('theology') || cleanSubject.includes('spiritual')) {
      matched.add('Spirituality / Religion');
    }
    if (cleanSubject.includes('art') || cleanSubject.includes('design') || cleanSubject.includes('music') || cleanSubject.includes('photography')) {
      matched.add('Art / Design / Music');
    }
    if (cleanSubject.includes('cookbook') || cleanSubject.includes('cooking') || cleanSubject.includes('food') || cleanSubject.includes('wine')) {
      matched.add('Cookbooks / Food');
    }
  }

  // Fallback check
  if (matched.size === 0) {
    for (const s of subjects) {
      const cleanSubject = s.toLowerCase();
      if (cleanSubject.includes('nonfiction') || cleanSubject.includes('non-fiction')) {
        matched.add('Non-Fiction');
      }
      if (cleanSubject.includes('fiction') || cleanSubject.includes('novel') || cleanSubject.includes('stories')) {
        matched.add('Fiction');
      }
    }
  }

  const res = Array.from(matched);
  return res.length > 0 ? res : ['Fiction'];
};

// Simplified cleanGenres using the base mapper
export const cleanGenres = (subjects: string[]): string => {
  return getValidGenresFromSubjects(subjects).slice(0, 3).join(', ');
};

export const extractDescription = (workData: any): string => {
  if (!workData || !workData.description) return '';
  if (typeof workData.description === 'string') {
    return workData.description;
  }
  if (workData.description && typeof workData.description === 'object' && workData.description.value) {
    return workData.description.value;
  }
  return '';
};
