import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Sparkles, Heart, Star, Users, Calendar, Type } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const goToGenerator = () => {
    navigate('/generator');
  };
  
  return <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in">
              Personalisierte Gedichte in Sekunden
            </span>
            <h1 className="heading-xl mb-6 animate-slide-up">
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
      <section className="py-20 bg-secondary/50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="subheading mb-4 block">Funktionen</span>
            <h2 className="heading-lg mb-6">
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
      <section className="py-20">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="subheading mb-4 block">Prozess</span>
            <h2 className="heading-lg mb-6">
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
          <button onClick={goToGenerator} className="bg-white text-primary hover:bg-white/90 btn-primary px-8 py-3 text-base">
            Jetzt starten
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 text-sm text-muted-foreground">
              <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
              <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
              <a href="/agb" className="hover:text-foreground transition-colors">AGB</a>
              <a href="/kontakt" className="hover:text-foreground transition-colors">Kontakt</a>
              <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0
}) => <div className="bg-white p-6 rounded-lg shadow-sm border border-border/50 hover:shadow-md transition-all duration-300" style={{
  animation: 'slide-up 0.5s ease-out forwards',
  animationDelay: `${delay}ms`,
  opacity: 0
}}>
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
      <Icon size={20} className="text-primary" />
    </div>
    <h3 className="text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>;

// Step Card Component
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

// Data
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
  description: "Erhalten Sie Ihr Gedicht, speichern Sie es oder teilen Sie es direkt mit Ihren Liebsten."
}];
export default Index;
