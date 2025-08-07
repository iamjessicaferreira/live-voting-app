import { Contestant } from '@/types';

const now = Date.now();

export const initialContestants: Contestant[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    talent: 'Opera Singing',
    description:
      'Classically trained soprano with a powerful voice. Specializes in Italian opera and has performed at prestigious venues across Europe.',
    imageUrl: '/sarah.png',
    currentVotes: 0,
    isActive: true,
    voteHistory: [
      { timestamp: now - 30000, votes: 0 },
      { timestamp: now - 15000, votes: 0 },
      { timestamp: now, votes: 0 },
    ],
  },
  {
    id: '2',
    name: 'Mike Chen',
    talent: 'Magic Tricks',
    description:
      'Master illusionist combining traditional sleight of hand with modern technology. Specializes in close-up magic and mentalism.',
    imageUrl: '/mike.png',
    currentVotes: 0,
    isActive: true,
    voteHistory: [
      { timestamp: now - 30000, votes: 0 },
      { timestamp: now - 15000, votes: 0 },
      { timestamp: now, votes: 0 },
    ],
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    talent: 'Contemporary Dance',
    description:
      'Contemporary dancer blending classical ballet with modern street dance. Creates emotionally charged performances that tell stories through movement.',
    imageUrl: '/emma.png',
    currentVotes: 0,
    isActive: true,
    voteHistory: [
      { timestamp: now - 30000, votes: 0 },
      { timestamp: now - 15000, votes: 0 },
      { timestamp: now, votes: 0 },
    ],
  },
  {
    id: '4',
    name: 'David Kim',
    talent: 'Guitar Performance',
    description:
      'Virtuoso guitarist blending classical, jazz, and rock styles. Creates unique arrangements with masterful fingerpicking technique.',
    imageUrl: '/david.png',
    currentVotes: 0,
    isActive: true,
    voteHistory: [
      { timestamp: now - 30000, votes: 0 },
      { timestamp: now - 15000, votes: 0 },
      { timestamp: now, votes: 0 },
    ],
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    talent: 'Stand-up Comedy',
    description:
      'Sharp-witted comedian known for observational humor and relatable stories. Combines self-deprecating humor with social commentary.',
    imageUrl: '/lisa.png',
    currentVotes: 0,
    isActive: true,
    voteHistory: [
      { timestamp: now - 30000, votes: 0 },
      { timestamp: now - 15000, votes: 0 },
      { timestamp: now, votes: 0 },
    ],
  },
  {
    id: '6',
    name: 'Alex Rivera',
    talent: 'Acrobatics',
    description:
      'Dynamic acrobat combining traditional circus skills with modern athleticism. Performs gravity-defying stunts with high-energy routines.',
    imageUrl: '/alex.png',
    currentVotes: 0,
    isActive: true,
    voteHistory: [
      { timestamp: now - 30000, votes: 0 },
      { timestamp: now - 15000, votes: 0 },
      { timestamp: now, votes: 0 },
    ],
  },
];
