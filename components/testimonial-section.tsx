export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        'Reflect has completely transformed how I organize my thoughts and research. The connections it helps me make are invaluable.',
      author: 'Sarah Johnson',
      role: 'Product Designer',
      company: 'Figma',
    },
    {
      quote:
        'As a researcher, I need to connect ideas across different papers and experiments. Reflect makes this process intuitive and powerful.',
      author: 'Dr. Michael Chen',
      role: 'Neuroscientist',
      company: 'Stanford University',
    },
    {
      quote:
        "I've tried dozens of note-taking apps, but Reflect is the only one that works the way my brain does. It's become essential to my creative process.",
      author: 'Alex Rivera',
      role: 'Content Creator',
      company: 'Independent',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-[#0a0413] to-[#050208]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What our users say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hear from people who have transformed their thinking with Reflect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-800 p-6 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="text-purple-400">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 11L8 17H5L7 11H4V5H10V11ZM20 11L18 17H15L17 11H14V5H20V11Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="text-gray-300">{testimonial.quote}</p>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
