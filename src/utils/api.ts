import { ApiError, ContestantData } from '@/types';

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export async function apiCall<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: 'Error on our servers, please try again later.',
          status: response.status,
          type: response.status >= 500 ? 'server' : 'validation',
        },
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Network error, please check your connection and try again.',
        type: 'network',
      },
    };
  }
}

export async function simulateVoteApi(
  contestantId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (Math.random() < 0.02) {
    return {
      data: null,
      error: {
        message: 'Voting service temporarily unavailable, please try again in a moment.',
        type: 'server',
      },
    };
  }

  return {
    data: { success: true },
    error: null,
  };
}

export async function simulateFetchContestants(): Promise<ApiResponse<ContestantData[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (Math.random() < 0.01) {
    return {
      data: null,
      error: {
        message: 'Unable to load contestants, please refresh the page.',
        type: 'server',
      },
    };
  }

  const mockContestants: ContestantData[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      talent: 'Opera Singing',
      description:
        'Sarah Johnson, 28, from New York, is a classically trained soprano with a powerful voice that can reach incredible heights. She specializes in Italian opera and has performed at prestigious venues across Europe. Her signature piece is "Nessun Dorma" from Puccini\'s Turandot.',
      imageUrl: '/sarah.png',
      currentVotes: 12,
      isActive: true,
    },
    {
      id: '2',
      name: 'Mike Chen',
      talent: 'Magic Tricks',
      description:
        'Mike Chen, 35, from San Francisco, is a master illusionist who combines traditional sleight of hand with modern technology. He specializes in close-up magic and mentalism, often incorporating elements of Chinese culture into his performances. His signature trick involves making objects disappear and reappear in impossible locations.',
      imageUrl: '/mike.png',
      currentVotes: 8,
      isActive: true,
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      talent: 'Contemporary Dance',
      description:
        'Emma Rodriguez, 24, from Los Angeles, is a contemporary dancer who tells stories through movement. She combines classical ballet training with modern dance techniques, creating performances that are both technically impressive and emotionally moving. Her choreography often explores themes of identity and cultural heritage.',
      imageUrl: '/emma.png',
      currentVotes: 15,
      isActive: true,
    },
    {
      id: '4',
      name: 'David Kim',
      talent: 'Classical Piano',
      description:
        'David Kim, 31, from Seoul, South Korea, is a virtuoso pianist who brings classical music to life with his passionate performances. He specializes in Romantic era composers like Chopin and Liszt, and his interpretations are known for their emotional depth and technical precision. He has won several international piano competitions.',
      imageUrl: '/david.png',
      currentVotes: 20,
      isActive: true,
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      talent: 'Stand-up Comedy',
      description:
        'Lisa Thompson, 29, from Chicago, is a rising star in the comedy world known for her sharp wit and relatable humor. She tackles everyday topics with a unique perspective, from dating in the digital age to the challenges of adulting. Her comedy style is observational and self-deprecating, making audiences laugh while nodding in agreement.',
      imageUrl: '/lisa.png',
      currentVotes: 18,
      isActive: true,
    },
    {
      id: '6',
      name: 'Alex Rivera',
      talent: 'Acrobatics',
      description:
        'Alex Rivera, 26, from Miami, is a professional acrobat who combines strength, flexibility, and artistry in breathtaking performances. He specializes in hand balancing and aerial acrobatics, often incorporating elements of contemporary circus arts. His routines are known for their fluidity and the way he makes impossible feats look effortless.',
      imageUrl: '/alex.png',
      currentVotes: 14,
      isActive: true,
    },
  ];

  return {
    data: mockContestants,
    error: null,
  };
}
