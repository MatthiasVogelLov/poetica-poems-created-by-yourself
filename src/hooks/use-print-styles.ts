
import { useEffect } from 'react';

export const usePrintStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .poem-container, .poem-container * {
          visibility: visible;
        }
        .poem-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 2rem;
          text-align: center;
        }
        .print-actions, .print-actions * {
          display: none !important;
        }
        .print-header {
          visibility: visible;
          display: flex !important;
          justify-content: flex-start;
          width: 100%;
          margin-bottom: 1rem;
        }
        .print-footer {
          visibility: visible;
          position: fixed;
          bottom: 20px;
          left: 0;
          width: 100%;
          text-align: center;
          font-family: serif;
          font-size: 12pt;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #eaeaea;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const printStyles = document.getElementById('print-styles');
      if (printStyles) {
        printStyles.remove();
      }
    };
  }, []);
};
