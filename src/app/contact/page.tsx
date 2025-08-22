export default function ContactPage() {
  return (
    <main className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 bg-tribal-gradient-cream">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-tribal-red text-center">
          Contact Us
        </h1>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-tribal-brown">
                Get in Touch
              </h2>
              <p className="text-base sm:text-lg text-tribal-brown mb-4 sm:mb-6">
                We'd love to hear from you! Reach out to us with any questions
                or inquiries.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-tribal-red mr-2 sm:mr-3 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="text-base sm:text-lg text-tribal-brown">
                    Email: contact@tribalfashion.com
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-tribal-red mr-2 sm:mr-3 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <p className="text-base sm:text-lg text-tribal-brown">
                    Phone: +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-tribal-brown">
                Visit Us
              </h2>
              <p className="text-base sm:text-lg text-tribal-brown mb-4 sm:mb-6">
                Our flagship store is located in the heart of Jharkhand, where
                you can experience our collection in person.
              </p>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-tribal-red mr-2 sm:mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <p className="text-base sm:text-lg text-tribal-brown">
                  Tribal Fashion Store
                  <br />
                  Main Bazaar, Ranchi
                  <br />
                  Jharkhand, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
