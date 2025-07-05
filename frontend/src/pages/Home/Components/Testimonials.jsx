import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Perera",
    role: "Colombo",
    text: "PillPath made it so easy to get my prescriptions delivered. The pharmacy matching is fast and I love the reminders!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Nuwan Silva",
    role: "Kandy",
    text: "I manage my whole family's meds with PillPath. The family profiles and refill reminders are a lifesaver.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Shanika Fernando",
    role: "Galle",
    text: "The OTC store is so convenient and the prices are great. Delivery was quick and support is excellent.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const Testimonial = () => (
  <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-white to-accent/10 relative overflow-hidden">
    <div className="absolute top-[-60px] right-[-40px] w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-80px] left-[-60px] w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl"></div>
    <div className="container mx-auto max-w-5xl relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">
          What Our Users Say
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4 rounded-full"></div>
        <p className="text-dark/70 max-w-xl mx-auto">
          Real stories from people who trust PillPath for their pharmacy needs.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-8 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
          >
            <Quote className="absolute top-6 left-6 text-accent/30 w-8 h-8" />
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full border-4 border-primary/30 shadow mb-4 object-cover"
            />
            <h3 className="font-bold text-lg text-primary mb-1">{t.name}</h3>
            <span className="text-xs text-dark/60 mb-3">{t.role}</span>
            <p className="text-dark/80 mb-4">{t.text}</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={18} className="text-accent fill-accent" />
              ))}
              {[...Array(5 - t.rating)].map((_, i) => (
                <Star key={i} size={18} className="text-gray-300" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonial;