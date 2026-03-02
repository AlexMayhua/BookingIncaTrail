import React, { useEffect, useRef } from 'react';

const TripAdvisorRatings = () => {
  const scriptRef = useRef(null);

  useEffect(() => {
      if (!scriptRef.current) { 
          const script = document.createElement('script');
          script.src = "https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=282&locationId=12614123&lang=es_PE&border=true&display_version=2";
          script.async = true;
          script.onload = () => { script.loadtrk = true; };

          document.body.appendChild(script);
          scriptRef.current = script;
      }

      // Limpiar el script cuando el componente se desmonte
      return () => {
          if (scriptRef.current) {
              document.body.removeChild(scriptRef.current);
              scriptRef.current = null;
          }
      };
  }, []);

  return (
    <div id="TA_cdsratingsonlynarrow282" className="TA_cdsratingsonlynarrow">
        <ul id="qmz2SuDfmbMC" className="TA_links QHBQ4Y4fg flex space-x-4">
            <li id="MyluMDEAkW" className="yxf6TWsjboo">
                <a target="_blank" href="https://www.tripadvisor.com.pe/Attraction_Review-g294314-d12614123-Reviews-Life_Expeditions-Cusco_Cusco_Region.html" rel="noopener noreferrer">
                    <img className="h-8" src="https://www.tripadvisor.com.pe/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg" alt="TripAdvisor"/>
                </a>
            </li>
        </ul>
    </div>
  );
};

export default TripAdvisorRatings;