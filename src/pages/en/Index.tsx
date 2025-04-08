import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/en/Header';
import Footer from '../../components/en/Footer';
import TellAFriend from '../../components/en/TellAFriend';
import { Sparkles, Heart, Star, Users, Calendar, Type } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const goToGenerator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/en/generator');
  };

  return <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              Personalized poems in seconds<br />
              written by you with AI assistance
            </span>
            <h1 className="heading-xl mb-6 animate-slide-up" itemProp="headline">
              Touching Poems for Every Occasion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up" style={{
            animationDelay: '100ms'
          }}>
              Create unique, personalized poems for your loved ones,
              special occasions, or to express your feelings.
            </p>
            <div className="animate-slide-up" style={{
            animationDelay: '200ms'
          }}>
              <button onClick={goToGenerator} className="btn-primary px-8 py-3 text-base">
                Create a Poem
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="subheading mb-4 block">Features</span>
            <h2 className="heading-lg mb-6" itemProp="alternativeHeadline">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg">
              Our intuitive platform offers everything you need for the perfect poem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} delay={index * 100} />)}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container-wide bg-slate-100">
          <div className="max-w-3xl mx-auto text-center mb-16">
            
            <h2 className="heading-lg mb-6 py-[15px]" itemProp="knowsAbout">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Just a few simple steps to your personalized poem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => <StepCard key={index} number={index + 1} title={step.title} description={step.description} delay={index * 100} />)}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <h2 className="heading-lg mb-6">
            Ready for Your Own Poem?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Create a unique, personalized poem today and surprise your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goToGenerator} className="bg-white text-primary hover:bg-white/90 btn-primary px-8 py-3 text-base">
              Get Started
            </button>
            <TellAFriend />
          </div>
        </div>
      </section>
      
      {/* Structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Poetica",
          "url": window.location.origin + '/en',
          "description": "Create personalized poems for any occasion with AI assistance",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/en/poemsland?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })
      }} />
      
      {/* Footer */}
      <Footer />
    </div>;
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0
}) => <div style={{
  animation: 'slide-up 0.5s ease-out forwards',
  animationDelay: `${delay}ms`,
  opacity: 0
}} className="p-6 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 bg-zinc-100">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <Icon size={20} className="text-primary" />
    </div>
    <h3 className="text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>;

const StepCard = ({
  number,
  title,
  description,
  delay = 0
}) => <div className="text-center" style={{
  animation: 'slide-up 0.5s ease-out forwards',
  animationDelay: `${delay}ms`,
  opacity: 0
}}>
    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
      <span className="text-xl font-medium text-primary">{number}</span>
    </div>
    <h3 className="text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>;

const features = [{
  icon: Users,
  title: "For Every Recipient",
  description: "Choose from various audiences to tailor the poem perfectly to the recipient."
}, {
  icon: Calendar,
  title: "For Every Occasion",
  description: "From birthdays to weddings, our poems suit any special moment."
}, {
  icon: Heart,
  title: "Various Themes",
  description: "Love, friendship, nature, and more - choose the theme that expresses your feelings."
}, {
  icon: Type,
  title: "Diverse Styles",
  description: "Classical, modern, or experimental - there's something for every taste."
}, {
  icon: Star,
  title: "Personalization",
  description: "Add personal keywords to make the poem even more individual."
}, {
  icon: Sparkles,
  title: "AI-Powered",
  description: "Our advanced AI ensures high-quality, creative results."
}];

const steps = [{
  title: "Choose Options",
  description: "Select audience, occasion, theme, style, and length of the poem."
}, {
  title: "Personalize",
  description: "Optionally add personal keywords to make the poem more individual."
}, {
  title: "Generate & Share",
  description: "Get your poem, save it, or share it directly with your loved ones."
}];

export default Index;
