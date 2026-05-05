import React, { useState } from "react";
import { 
  ChevronDown, ThumbsUp, ThumbsDown, 
  MessageCircle, Sparkles, Send
} from "lucide-react";

const FAQSection = ({ faqs, activeAccordion, setActiveAccordion }) => {
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [showThankYou, setShowThankYou] = useState({});

  const handleHelpfulVote = (index, isHelpful) => {
    setHelpfulVotes(prev => ({ ...prev, [index]: isHelpful ? 'helpful' : 'not-helpful' }));
    setShowThankYou(prev => ({ ...prev, [index]: true }));
    
    setTimeout(() => {
      setShowThankYou(prev => ({ ...prev, [index]: false }));
    }, 3000);
  };

  return (
    <section id="faq-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements - question marks, books, pens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Question Marks */}
        <div className="absolute top-20 left-10 text-6xl text-blue-200 opacity-20 animate-float">?</div>
        <div className="absolute top-40 right-20 text-5xl text-purple-200 opacity-20 animate-float-delayed-1">?</div>
        <div className="absolute bottom-32 left-1/4 text-7xl text-indigo-200 opacity-20 animate-float-delayed-2">?</div>
        <div className="absolute bottom-20 right-1/3 text-5xl text-blue-200 opacity-20 animate-float-delayed-3">?</div>
        
        {/* Floating Books */}
        <div className="absolute top-1/3 right-10 text-4xl opacity-20 animate-float-delayed-1">📚</div>
        <div className="absolute bottom-1/3 left-20 text-4xl opacity-20 animate-float-delayed-3">📖</div>
        
        {/* Floating Pens */}
        <div className="absolute top-1/2 left-1/3 text-3xl opacity-20 animate-float-delayed-2">✏️</div>
        <div className="absolute bottom-1/4 right-1/4 text-3xl opacity-20 animate-float">🖊️</div>
        
        {/* Lightbulbs for ideas */}
        <div className="absolute top-1/4 right-1/3 text-4xl opacity-20 animate-float-delayed-3">💡</div>
        <div className="absolute bottom-1/2 left-1/2 text-3xl opacity-20 animate-float-delayed-1">💡</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Header & CTA */}
          <div className="lg:sticky lg:top-24">
            
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
              Frequently Asked Questions
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Everything you need to know about JoinEazy. Can't find the answer you're looking for? Feel free to reach out to our team.
            </p>

            {/* CTA Card - Redesigned with dotted border */}
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                  <p className="text-gray-600 text-sm">
                    Our support team is here to help you succeed.
                  </p>
                </div>
              </div>
              <a
                href="mailto:siddhartha20ucse210@mahindrauniversity.edu.in"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg text-sm"
              >
                Contact
                <Send className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-500 mt-3">
                siddhartha20ucse210@mahindrauniversity.edu.in
              </p>
            </div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s backwards`
                }}
              >
                <div className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  activeAccordion === index 
                    ? 'border-blue-200 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  {/* Question */}
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
                    className="w-full px-6 py-5 flex items-start gap-4 text-left transition-all duration-300 hover:bg-gray-50"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 mt-0.5 transition-all duration-300 ${
                      activeAccordion === index ? 'rotate-180' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        activeAccordion === index 
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                          : 'bg-gray-100 group-hover:bg-blue-50'
                      }`}>
                        <ChevronDown className={`w-5 h-5 transition-colors ${
                          activeAccordion === index ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                        }`} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg transition-colors ${
                        activeAccordion === index 
                          ? 'text-blue-600' 
                          : 'text-gray-900'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                  </button>
                  
                  {/* Answer */}
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      activeAccordion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pl-[4.5rem]">
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {faq.answer}
                      </p>

                      {/* Feedback */}
                      <div className="pt-4 border-t border-gray-100">
                        {!showThankYou[index] && !helpfulVotes[index] ? (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 font-medium">Was this helpful?</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleHelpfulVote(index, true)}
                                className="px-4 py-2 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 text-gray-700 hover:text-green-700 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                Yes
                              </button>
                              <button
                                onClick={() => handleHelpfulVote(index, false)}
                                className="px-4 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-700 hover:text-orange-700 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                No
                              </button>
                            </div>
                          </div>
                        ) : showThankYou[index] ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Thanks for your feedback!
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            ✓ {helpfulVotes[index] === 'helpful' ? 'Glad we could help!' : 'Thank you!'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed-1 {
          animation: float 3.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-delayed-2 {
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-delayed-3 {
          animation: float 3.2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
};

export default FAQSection;