
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TellAFriend from '../components/TellAFriend';
import { Sparkles, Heart, Star, Users, Calendar, Type } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const goToGenerator = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/generator');
  };

  return <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              Personalisierte Gedichte in Sekunden<br />
              von Dir mit KI-Unterstützung geschrieben
            </span>
            <h1 className="heading-xl mb-6 animate-slide-up" itemProp="headline">
              Berührende Gedichte für jeden Anlass
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up" style={{
            animationDelay: '100ms'
          }}>
              Erstellen Sie einzigartige, personalisierte Gedichte für Ihre Liebsten,
              besondere Anlässe oder um Ihre Gefühle auszudrücken.
            </p>
            <div className="animate-slide-up" style={{
            animationDelay: '200ms'
          }}>
              <button onClick={goToGenerator} className="btn-primary px-8 py-3 text-base">
                Gedicht erstellen
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="subheading mb-4 block">Funktionen</span>
            <h2 className="heading-lg mb-6" itemProp="alternativeHeadline">
              Alles was Sie brauchen
            </h2>
            <p className="text-muted-foreground text-lg">
              Unsere intuitive Plattform bietet alles, was Sie für das perfekte Gedicht benötigen.
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
              So funktioniert es
            </h2>
            <p className="text-muted-foreground text-lg">
              In nur wenigen einfachen Schritten zu Ihrem personalisierten Gedicht.
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
            Bereit für Ihr eigenes Gedicht?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Erstellen Sie noch heute ein einzigartiges, personalisiertes Gedicht und überraschen Sie Ihre Liebsten.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goToGenerator} className="bg-white text-primary hover:bg-white/90 btn-primary px-8 py-3 text-base">
              Jetzt starten
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
          "name": "PoemsLand",
          "url": window.location.origin,
          "description": "Personalisierte Gedichte für jeden Anlass erstellen mit KI-Unterstützung",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/poemsland?q={search_term_string}`,
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
  title: "Für jeden Empfänger",
  description: "Wählen Sie aus verschiedenen Zielgruppen, um das Gedicht perfekt auf den Empfänger abzustimmen."
}, {
  icon: Calendar,
  title: "Für jeden Anlass",
  description: "Von Geburtstagen bis Hochzeiten, unsere Gedichte passen zu jedem besonderen Moment."
}, {
  icon: Heart,
  title: "Verschiedene Themen",
  description: "Liebe, Freundschaft, Natur und mehr - wählen Sie das Thema, das Ihre Gefühle ausdrückt."
}, {
  icon: Type,
  title: "Vielfältige Stile",
  description: "Klassisch, modern oder experimentell - für jeden Geschmack ist etwas dabei."
}, {
  icon: Star,
  title: "Personalisierung",
  description: "Fügen Sie persönliche Schlüsselwörter hinzu, um das Gedicht noch individueller zu gestalten."
}, {
  icon: Sparkles,
  title: "KI-gestützt",
  description: "Unsere fortschrittliche KI sorgt für qualitativ hochwertige, kreative Ergebnisse."
}];

const steps = [{
  title: "Optionen wählen",
  description: "Wählen Sie Zielgruppe, Anlass, Thema, Stil und Länge des Gedichts aus."
}, {
  title: "Personalisieren",
  description: "Fügen Sie optional persönliche Schlüsselwörter hinzu, um das Gedicht individueller zu gestalten."
}, {
  title: "Generieren & Teilen",
  description: "Erhalten Sie Ihr Gedicht, speichern Sie es oder teilen Sie direkt mit Ihren Liebsten."
}];

export default Index;
