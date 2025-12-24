import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const LGBTCommunity = () => {
  const articles = [
    {
      id: 1,
      title: "My Journey to Self-Acceptance",
      author: "Alex Chen",
      excerpt: "After years of hiding my true self, I finally found the courage to come out to my family and friends...",
      image: "🌈",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Supporting LGBTQ+ Youth in Schools",
      author: "Dr. Maria Rodriguez",
      excerpt: "Creating safe spaces and inclusive environments for LGBTQ+ students is crucial for their mental wellbeing...",
      image: "📚",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Celebrating Pride: From Struggle to Strength",
      author: "Jordan Taylor",
      excerpt: "Pride month isn't just about parades—it's about honoring the resilience of our community...",
      image: "🏳️‍🌈",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Building Queer Families",
      author: "Sam & Riley Patel",
      excerpt: "Our journey to parenthood as a same-sex couple taught us about love, acceptance, and chosen family...",
      image: "👨‍👩‍👧‍👦",
      readTime: "6 min read"
    }
  ]

  const helpCards = [
    {
      title: "Crisis Support",
      description: "24/7 confidential support for LGBTQ+ individuals in crisis",
      icon: "🆘",
      contact: "1-888-843-4564",
      color: "from-pink-50 to-pink-100"
    },
    {
      title: "Legal Aid",
      description: "Free legal support for LGBTQ+ rights and discrimination cases",
      icon: "⚖️",
      contact: "Legal Helpline",
      color: "from-pink-50 to-pink-100"
    },
    {
      title: "Mental Health Support",
      description: "Specialized therapy for LGBTQ+ mental health concerns",
      icon: "🧠",
      contact: "Find a Therapist",
      color: "from-pink-50 to-pink-100"
    },
    {
      title: "Community Groups",
      description: "Local support groups and LGBTQ+ community events",
      icon: "🤝",
      contact: "Find Groups Near You",
      color: "from-pink-50 to-pink-100"
    },
    {
      title: "Housing Assistance",
      description: "Safe housing support for LGBTQ+ youth and adults",
      icon: "🏠",
      contact: "Housing Hotline",
      color: "from-pink-50 to-pink-100"
    },
    {
      title: "Career Counseling",
      description: "Professional guidance for LGBTQ+ workplace concerns",
      icon: "💼",
      contact: "Career Support",
      color: "from-pink-50 to-pink-100"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-25 to-pink-100">
      <Navbar />

      {/* Welcome Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-pink-100 via-pink-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-800 via-pink-700 to-pink-600 bg-clip-text text-transparent mb-8 leading-tight">
              Welcome to Your Safe Space
            </h1>
            <p className="text-2xl text-pink-700 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
              We're here to support your journey with compassion, understanding, and resources
              tailored to the LGBTQ+ community.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-pink-200/50 mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-6">
              Tell Us More About Yourself
            </h2>
            <p className="text-lg text-pink-600 mb-8 font-light">
              Help us personalize your experience by sharing a bit about your journey.
              Everything you share is completely confidential and secure.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
              Start Your Personal Journey
            </button>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white via-pink-25 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
              Stories of Courage & Hope
            </h2>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
              Real stories from our community members sharing their experiences of coming out,
              finding acceptance, and building fulfilling lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden group cursor-pointer"
              >
                <div className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="text-5xl">{article.image}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-pink-900 mb-2 group-hover:text-pink-700 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-pink-600 font-medium mb-3">by {article.author}</p>
                      <span className="text-sm text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  <p className="text-pink-700 leading-relaxed mb-6 font-light">
                    {article.excerpt}
                  </p>
                  <button className="text-pink-600 hover:text-pink-700 font-semibold transition-colors group-hover:translate-x-2 transform duration-300">
                    Read Full Story →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global LGBT Acceptability Heat Map */}
      <section className="py-24 px-4 bg-gradient-to-br from-pink-50 via-pink-25 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
              Global LGBT Acceptability Map
            </h2>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
              Visual representation of LGBTQ+ acceptance and legal protections worldwide.
              Darker shades indicate higher acceptance and safety.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-200/50">
            {/* Heat Map Grid - Simplified World Map */}
            <div className="mb-8">
              {/* Top Row - North America & Europe */}
              <div className="grid grid-cols-12 gap-1 mb-2">
                {/* North America */}
                <div className="col-span-3">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">North America</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-200 to-pink-100 rounded-sm border border-pink-300 opacity-90" title="USA - High Acceptance"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-150 to-pink-75 rounded-sm border border-pink-300 opacity-95" title="Canada - Very High Acceptance"></div>
                  </div>
                </div>

                {/* Atlantic Ocean space */}
                <div className="col-span-1"></div>

                {/* Europe */}
                <div className="col-span-5">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">Europe</div>
                  <div className="grid grid-cols-5 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-150 to-pink-75 rounded-sm border border-pink-300 opacity-95" title="Netherlands - Very High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-200 to-pink-100 rounded-sm border border-pink-300 opacity-90" title="Germany - High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-250 to-pink-150 rounded-sm border border-pink-300 opacity-80" title="France - Moderate-High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-200 to-pink-100 rounded-sm border border-pink-300 opacity-85" title="UK - High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-100 to-pink-50 rounded-sm border border-pink-300 opacity-75" title="Eastern Europe - Moderate"></div>
                  </div>
                </div>

                {/* Asia */}
                <div className="col-span-3">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">Asia</div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-50 to-pink-25 rounded-sm border border-pink-300 opacity-60" title="China - Low"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-100 to-pink-50 rounded-sm border border-pink-300 opacity-70" title="Japan - Moderate"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-75 to-pink-25 rounded-sm border border-pink-300 opacity-65" title="India - Low-Moderate"></div>
                  </div>
                </div>
              </div>

              {/* Middle Row - Africa & Middle East */}
              <div className="grid grid-cols-12 gap-1 mb-2">
                <div className="col-span-3">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">Africa</div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-25 to-pink-10 rounded-sm border border-pink-300 opacity-40" title="South Africa - Low"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-10 to-pink-5 rounded-sm border border-pink-300 opacity-30" title="Nigeria - Very Low"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-50 to-pink-25 rounded-sm border border-pink-300 opacity-50" title="Kenya - Low-Moderate"></div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">Middle East & Central Asia</div>
                  <div className="grid grid-cols-6 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-10 to-pink-5 rounded-sm border border-pink-300 opacity-25" title="Saudi Arabia - Very Low"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-25 to-pink-10 rounded-sm border border-pink-300 opacity-35" title="Turkey - Low"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-5 to-pink-2 rounded-sm border border-pink-300 opacity-20" title="Iran - Extremely Low"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-75 to-pink-25 rounded-sm border border-pink-300 opacity-55" title="Israel - Moderate"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-50 to-pink-25 rounded-sm border border-pink-300 opacity-45" title="UAE - Low-Moderate"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-25 to-pink-10 rounded-sm border border-pink-300 opacity-40" title="Pakistan - Low"></div>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">Oceania</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-150 to-pink-75 rounded-sm border border-pink-300 opacity-85" title="Australia - Very High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-200 to-pink-100 rounded-sm border border-pink-300 opacity-80" title="New Zealand - High"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - South America & Antarctica */}
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-4">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">South America</div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-100 to-pink-50 rounded-sm border border-pink-300 opacity-75" title="Brazil - Moderate"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-150 to-pink-75 rounded-sm border border-pink-300 opacity-85" title="Argentina - Very High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-200 to-pink-100 rounded-sm border border-pink-300 opacity-80" title="Uruguay - High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-75 to-pink-25 rounded-sm border border-pink-300 opacity-65" title="Colombia - Moderate-Low"></div>
                  </div>
                </div>

                <div className="col-span-4"></div>

                <div className="col-span-4">
                  <div className="text-xs font-semibold text-pink-800 text-center mb-1">Southeast Asia</div>
                  <div className="grid grid-cols-4 gap-1">
                    <div className="h-12 bg-gradient-to-br from-pink-100 to-pink-50 rounded-sm border border-pink-300 opacity-70" title="Thailand - Moderate"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-150 to-pink-75 rounded-sm border border-pink-300 opacity-80" title="Singapore - High"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-50 to-pink-25 rounded-sm border border-pink-300 opacity-60" title="Indonesia - Low-Moderate"></div>
                    <div className="h-12 bg-gradient-to-br from-pink-25 to-pink-10 rounded-sm border border-pink-300 opacity-45" title="Malaysia - Low"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-150 to-pink-75 rounded border border-pink-300"></div>
                <span className="text-sm font-medium text-pink-800">Very High Acceptance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-200 to-pink-100 rounded border border-pink-300"></div>
                <span className="text-sm font-medium text-pink-800">High Acceptance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-100 to-pink-50 rounded border border-pink-300"></div>
                <span className="text-sm font-medium text-pink-800">Moderate Acceptance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-50 to-pink-25 rounded border border-pink-300"></div>
                <span className="text-sm font-medium text-pink-800">Low Acceptance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-pink-25 to-pink-10 rounded border border-pink-300"></div>
                <span className="text-sm font-medium text-pink-800">Very Low Acceptance</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl text-center border border-pink-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-2">29</div>
                <div className="text-sm text-pink-700 font-medium">Countries with Marriage Equality</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl text-center border border-pink-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-2">72</div>
                <div className="text-sm text-pink-700 font-medium">Countries Criminalize Homosexuality</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl text-center border border-pink-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-2">15%</div>
                <div className="text-sm text-pink-700 font-medium">Global Population Coverage</div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-2xl text-center border border-pink-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-600 bg-clip-text text-transparent mb-2">2024</div>
                <div className="text-sm text-pink-700 font-medium">Last Updated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Cards Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-white via-pink-25 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-800 to-pink-700 bg-clip-text text-transparent mb-8">
              Support & Resources
            </h2>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto font-light">
              Access specialized support services designed specifically for the LGBTQ+ community.
              You're not alone—we're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-pink-100/50 overflow-hidden group cursor-pointer"
              >
                <div className={`bg-gradient-to-br from-pink-50 to-pink-100 p-8`}>
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-pink-700 mb-4">{card.title}</h3>
                  <p className="text-pink-600 leading-relaxed mb-6 font-light">
                    {card.description}
                  </p>
                </div>
                <div className="p-8 bg-gradient-to-br from-pink-50 to-white">
                  <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    {card.contact}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LGBTCommunity
