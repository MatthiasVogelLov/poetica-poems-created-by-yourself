
import React from 'react';
import Header from '../components/Header';
import PoemForm from '../components/PoemForm';
import HeaderContent from '../components/generator/HeaderContent';
import GeneratorFooter from '../components/GeneratorFooter';

const Generator = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20">
        <div className="container-narrow">
          <HeaderContent />
          <PoemForm />
        </div>
      </div>
      
      <GeneratorFooter />
    </div>
  );
};

export default Generator;
