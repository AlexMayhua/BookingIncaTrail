export default function ToursCategoryLayout() {
  const categories = [
    {
      id: 'cultural',
      accent: 'from-rose-600/95 via-red-600/85 to-orange-500/80',
      icon: (
        <svg
          viewBox='0 0 24 24'
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M4 20h16' />
          <path d='M6 20V9l6-4 6 4v11' />
          <path d='M9 20v-4h6v4' />
          <path d='M8 9h8' />
        </svg>
      ),
      heroImage:
        'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80',
      sideImage:
        'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
      cards: [
        'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      id: 'adventure',
      accent: 'from-amber-500/95 via-yellow-500/80 to-lime-400/70',
      icon: (
        <svg
          viewBox='0 0 24 24'
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M3 19h18' />
          <path d='m5 19 5.5-9 3.5 5 2.5-4 2.5 8' />
          <path d='M15 5h.01' />
        </svg>
      ),
      heroImage:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      sideImage:
        'https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1200&q=80',
      cards: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      id: 'nature',
      accent: 'from-emerald-500/95 via-green-500/80 to-teal-400/75',
      icon: (
        <svg
          viewBox='0 0 24 24'
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M12 20V9' />
          <path d='M12 9c0-3 2-5 5-5 0 3-2 5-5 5Z' />
          <path d='M12 13c0-2.5-2-4.5-5-4.5 0 3 2 4.5 5 4.5Z' />
          <path d='M8 20h8' />
        </svg>
      ),
      heroImage:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80',
      sideImage:
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      cards: [
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      id: 'gastronomy',
      accent: 'from-orange-500/95 via-amber-500/85 to-yellow-400/75',
      icon: (
        <svg
          viewBox='0 0 24 24'
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M7 4v7' />
          <path d='M10 4v7' />
          <path d='M7 7h3' />
          <path d='M8.5 11v9' />
          <path d='M15 4c1.5 2 1.5 5 0 7v9' />
        </svg>
      ),
      heroImage:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80',
      sideImage:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      cards: [
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      id: 'experiential',
      accent: 'from-sky-500/95 via-cyan-500/80 to-blue-400/70',
      icon: (
        <svg
          viewBox='0 0 24 24'
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M12 21a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z' />
          <path d='M12 3v4' />
          <path d='M3 12h4' />
          <path d='M17 12h4' />
          <path d='M12 12l3 2' />
        </svg>
      ),
      heroImage:
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=80',
      sideImage:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
      cards: [
        'https://images.unsplash.com/photo-1516302350523-f9ec74888b8a?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
      ],
    },
    {
      id: 'entertainment',
      accent: 'from-violet-500/95 via-fuchsia-500/85 to-pink-500/75',
      icon: (
        <svg
          viewBox='0 0 24 24'
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M8 4v16' />
          <path d='M16 4v16' />
          <path d='M8 7h8' />
          <path d='M8 12h8' />
          <path d='M8 17h8' />
        </svg>
      ),
      heroImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80',
      sideImage:
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
      cards: [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80',
      ],
    },
  ];

  const active = categories[0];

  return (
    <section className='relative overflow-hidden bg-[#0f1014] px-4 py-10 text-white sm:px-6 lg:px-8'>
      <div className='absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:34px_34px]' />
      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%,transparent_76%,rgba(255,255,255,0.03))]' />

      <div className='relative mx-auto max-w-7xl'>
        <div className='mb-8 flex flex-wrap items-center justify-center gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-3 backdrop-blur-md'>
          {categories.map((item, index) => {
            const isActive = index === 0;
            return (
              <button
                key={item.id}
                className={`group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? 'border-white/20 bg-white text-white shadow-[0_20px_45px_-20px_rgba(0,0,0,0.75)]'
                    : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/85'
                }`}>
                <span
                  className={`absolute inset-0 bg-gradient-to-br ${item.accent} ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}
                />
                <span className='absolute inset-[1px] rounded-[15px] bg-[#12141b]/95' />
                <span className='relative z-10'>{item.icon}</span>
              </button>
            );
          })}
        </div>

        <div className='grid gap-6 lg:grid-cols-[1.35fr_0.9fr]'>
          <div className='relative min-h-[520px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/5 shadow-[0_35px_100px_-35px_rgba(0,0,0,0.85)]'>
            <img
              src={active.heroImage}
              alt=''
              className='absolute inset-0 h-full w-full object-cover'
            />
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${active.accent} opacity-30`}
            />
            <div className='absolute inset-0 bg-[linear-gradient(130deg,rgba(0,0,0,0.78),rgba(0,0,0,0.18)_45%,rgba(0,0,0,0.74))]' />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.13),transparent_35%)]' />

            <div className='relative flex h-full flex-col justify-between p-5 sm:p-7 lg:p-8'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${active.accent} shadow-lg`}>
                    {active.icon}
                  </div>
                  <div className='space-y-2'>
                    <div className='h-2.5 w-20 rounded-full bg-white/55' />
                    <div className='h-2.5 w-14 rounded-full bg-white/30' />
                  </div>
                </div>

                <div className='rounded-full border border-white/10 bg-black/25 p-1.5 backdrop-blur-sm'>
                  <div className='h-10 w-10 rounded-full border border-white/10 bg-white/5' />
                </div>
              </div>

              <div className='max-w-[72%] space-y-5'>
                <div className='flex flex-wrap gap-2'>
                  <div className='h-8 w-24 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm' />
                  <div className='h-8 w-20 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm' />
                </div>

                <div className='space-y-3'>
                  <div className='h-5 w-3/4 rounded-full bg-white/80' />
                  <div className='h-5 w-2/3 rounded-full bg-white/80' />
                  <div className='h-4 w-full rounded-full bg-white/25' />
                  <div className='h-4 w-11/12 rounded-full bg-white/20' />
                  <div className='h-4 w-8/12 rounded-full bg-white/15' />
                </div>

                <div className='flex items-center gap-3 pt-2'>
                  <div
                    className={`h-12 w-36 rounded-2xl bg-gradient-to-r ${active.accent} shadow-lg`}
                  />
                  <div className='h-12 w-12 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm' />
                </div>
              </div>
            </div>

            <div className='absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 sm:px-6 sm:pb-6'>
              <div className='grid gap-4 md:grid-cols-3'>
                {active.cards.map((card, i) => (
                  <article
                    key={card}
                    className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#171920] shadow-[0_22px_50px_-24px_rgba(0,0,0,0.95)] ${
                      i === 0
                        ? 'md:-translate-y-2'
                        : i === 1
                          ? 'md:translate-y-5'
                          : 'md:-translate-y-5'
                    } transition-transform duration-500 hover:-translate-y-2`}>
                    <div className='relative h-56'>
                      <img
                        src={card}
                        alt=''
                        className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'
                      />
                      <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.1)_30%,rgba(0,0,0,0.88))]' />
                      <div
                        className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${active.accent} opacity-20`}
                      />

                      <div className='absolute left-4 top-4 flex items-center gap-2'>
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${active.accent} shadow-lg`}>
                          <span className='scale-90'>{active.icon}</span>
                        </div>
                        <div className='h-3 w-16 rounded-full bg-white/45' />
                      </div>

                      <div className='absolute right-4 top-4 h-10 w-10 rounded-full border border-white/10 bg-black/25 backdrop-blur-sm' />

                      <div className='absolute inset-x-4 bottom-4 space-y-3'>
                        <div className='h-3 w-24 rounded-full bg-white/35' />
                        <div className='h-5 w-10/12 rounded-full bg-white/80' />
                        <div className='h-5 w-8/12 rounded-full bg-white/75' />
                        <div className='flex items-center justify-between pt-1'>
                          <div className='h-3.5 w-28 rounded-full bg-white/25' />
                          <div
                            className={`h-5 w-20 rounded-full bg-gradient-to-r ${active.accent}`}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );  
}
