export default function TravelSectionTitle({ title }) {
  return (
    <div className='text-center '>
      <h2
        className='text-2xl md:text-4xl lg:text-5xl font-bold text-primary inline-block'
        style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <div className='flex items-center justify-center gap-3'>
        <div className='w-16 h-1 bg-secondary rounded-full' />
        <div className='w-8 h-1 bg-secondary/60 rounded-full' />
        <div className='w-4 h-1 bg-secondary/30 rounded-full' />
      </div>
    </div>
  );
}
