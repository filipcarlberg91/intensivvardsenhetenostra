import React from 'react';
import {
  HomeIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  FlaskIcon,
  DropletIcon,
  NutritionIcon,
  PillIcon,
  VentilatorIcon,
  LayersIcon,
  StarIcon,
  SedationIcon,
  AbdomenIcon,
  InfectionIcon,
  GynIcon,
  PalliativeIcon,
  DonationIcon,
} from './Icons';

interface ClinicalSubnavProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  favoritesCount: number;
}

export const ClinicalSubnav: React.FC<ClinicalSubnavProps> = ({
  activeCategory,
  onSelectCategory,
  favoritesCount,
}) => {
  const isDocumentCategory = [
    'Respiration',
    'Circulation',
    'Nutrition_Docs',
    'CRRT',
    'Elimination',
    'Omvårdnad',
    'Anhöriga',
    'ALL'
  ].includes(activeCategory);

  return (
    <nav className="clinical-subnav-strip" aria-label="Kliniska sektioner">
      <div className="subnav-container">
        {/* 0. Startsida */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'HOME' ? 'active' : ''}`}
          onClick={() => onSelectCategory('HOME')}
          title="Startsida: Översikt, genvägar och kliniska moduler"
        >
          <span className="subnav-pill-icon" style={{ color: '#0284c7' }}>
            <HomeIcon size={16} />
          </span>
          <span className="subnav-pill-title">Startsida</span>
          <span className="subnav-pill-desc">Översikt & Guider</span>
        </button>

        {/* 1. Smärta & Sedering */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'PAIN_SEDATION' ? 'active' : ''}`}
          onClick={() => onSelectCategory('PAIN_SEDATION')}
          title="Smärtskattning (CPOT) & Sederingsgrad (RASS)"
        >
          <span className="subnav-pill-icon" style={{ color: '#d946ef' }}>
            <HeartPulseIcon size={16} />
          </span>
          <span className="subnav-pill-title">Smärta & Sedering</span>
          <span className="subnav-pill-desc">CPOT & RASS</span>
        </button>

        {/* 2. Sjukdomar */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'DISEASES' ? 'active' : ''}`}
          onClick={() => onSelectCategory('DISEASES')}
          title="Sjukdomstillstånd på IVA (Chock, Respirationssvikt, AKI, Leversvikt m.fl.)"
        >
          <span className="subnav-pill-icon" style={{ color: '#e11d48' }}>
            <StethoscopeIcon size={16} />
          </span>
          <span className="subnav-pill-title">Sjukdomar</span>
          <span className="subnav-pill-desc">15 tillstånd</span>
        </button>

        {/* 3. Blodgas (Radiometer ABL) */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'ACID_BASE' ? 'active' : ''}`}
          onClick={() => onSelectCategory('ACID_BASE')}
          title="Syra-Bas & Blodgaskalkylator (Radiometer ABL, Horovitz & Winters)"
        >
          <span className="subnav-pill-icon" style={{ color: '#2563eb' }}>
            <FlaskIcon size={16} />
          </span>
          <span className="subnav-pill-title">Blodgas (ABL)</span>
          <span className="subnav-pill-desc">Vent/NIV/Högflöde</span>
        </button>

        {/* 4. Vätskebalans */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'FLUID_BALANCE' ? 'active' : ''}`}
          onClick={() => onSelectCategory('FLUID_BALANCE')}
          title="Vätskebalans, Diuresmål (12, 18, 24, 06), Östra Excel & Infusionsvätskor"
        >
          <span className="subnav-pill-icon" style={{ color: '#059669' }}>
            <DropletIcon size={16} />
          </span>
          <span className="subnav-pill-title">Vätskebalans</span>
          <span className="subnav-pill-desc">Diures & 24h Balans</span>
        </button>

        {/* 5. Nutrition */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'NUTRITION' ? 'active' : ''}`}
          onClick={() => onSelectCategory('NUTRITION')}
          title="ESPEN Nutrition, Propofolavräkning & Kaloritabell IVA 343"
        >
          <span className="subnav-pill-icon" style={{ color: '#d97706' }}>
            <NutritionIcon size={16} />
          </span>
          <span className="subnav-pill-title">Nutrition</span>
          <span className="subnav-pill-desc">ESPEN & IVA 343</span>
        </button>

        {/* 6. Dos & CVK */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'DRUGS' ? 'active' : ''}`}
          onClick={() => onSelectCategory('DRUGS')}
          title="Individanpassad Doskalkylator, Spädningsguide & Blandbarhet i CVK"
        >
          <span className="subnav-pill-icon" style={{ color: '#0284c7' }}>
            <PillIcon size={16} />
          </span>
          <span className="subnav-pill-title">Dos & CVK</span>
          <span className="subnav-pill-desc">Kalkylator & Y-site</span>
        </button>

        {/* NYA IVA-KATEGORIER */}
        {/* Läkemedel (Ny IVA-Kategori med kompakt lista, sök, favoriter & farmakologi) */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Läkemedel' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Läkemedel')}
          title="IVA-Kategori Läkemedel: Komplett kompakt läkemedelslista, sökfunktion, favoriter, effekt, biverkningar & halveringstid"
        >
          <span className="subnav-pill-icon" style={{ color: '#7c3aed' }}>
            <PillIcon size={16} />
          </span>
          <span className="subnav-pill-title">Läkemedel</span>
          <span className="subnav-pill-desc">IVA/PostOp Register</span>
        </button>

        {/* Sedering PM */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Sedering' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Sedering')}
          title="Sedering, Smärtlindring, Delirium & Urträning"
        >
          <span className="subnav-pill-icon" style={{ color: '#d946ef' }}>
            <SedationIcon size={16} />
          </span>
          <span className="subnav-pill-title">Sedering</span>
          <span className="subnav-pill-desc">RASS & Delirium</span>
        </button>

        {/* Buk */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Buk' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Buk')}
          title="Intraabdominellt tryck (IAP), Compartment, Ileus & Pankreatit"
        >
          <span className="subnav-pill-icon" style={{ color: '#ea580c' }}>
            <AbdomenIcon size={16} />
          </span>
          <span className="subnav-pill-title">Buk</span>
          <span className="subnav-pill-desc">IAP & Compartment</span>
        </button>

        {/* Infektion */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Infektion' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Infektion')}
          title="Sepsis-3, Septisk chock, Antibiotikaval & Odlingar"
        >
          <span className="subnav-pill-icon" style={{ color: '#dc2626' }}>
            <InfectionIcon size={16} />
          </span>
          <span className="subnav-pill-title">Infektion</span>
          <span className="subnav-pill-desc">Sepsis & Antibiotika</span>
        </button>

        {/* Gynekologi */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Gynekologi' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Gynekologi')}
          title="Preeklampsi, Eklampsi, HELLP & Postpartumblödning"
        >
          <span className="subnav-pill-icon" style={{ color: '#db2777' }}>
            <GynIcon size={16} />
          </span>
          <span className="subnav-pill-title">Gynekologi</span>
          <span className="subnav-pill-desc">Preeklampsi & HELLP</span>
        </button>

        {/* Avslut */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Avslut' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Avslut')}
          title="Palliativ vård, Brytpunkt & Avslutande av livsuppehållande behandling"
        >
          <span className="subnav-pill-icon" style={{ color: '#475569' }}>
            <PalliativeIcon size={16} />
          </span>
          <span className="subnav-pill-title">Avslut</span>
          <span className="subnav-pill-desc">Palliation & Brytpunkt</span>
        </button>

        {/* Donation */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'Donation' ? 'active' : ''}`}
          onClick={() => onSelectCategory('Donation')}
          title="Organdonation på IVA: DBD, DCD, Donationsprocess & Checklista"
        >
          <span className="subnav-pill-icon" style={{ color: '#059669' }}>
            <DonationIcon size={16} />
          </span>
          <span className="subnav-pill-title">Donation</span>
          <span className="subnav-pill-desc">DBD & DCD Process</span>
        </button>

        {/* Apparatur (Servo-U) */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'EQUIPMENT' ? 'active' : ''}`}
          onClick={() => onSelectCategory('EQUIPMENT')}
          title="Medicinteknisk Apparatur & Servo-U Ventilator på IVA"
        >
          <span className="subnav-pill-icon" style={{ color: '#0891b2' }}>
            <VentilatorIcon size={16} />
          </span>
          <span className="subnav-pill-title">Apparatur</span>
          <span className="subnav-pill-desc">Servo-U Ventilator</span>
        </button>

        {/* Övriga Rutiner/PM */}
        <button
          className={`subnav-pill-btn ${isDocumentCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory('Respiration')}
          title="Alla avdelningens rutiner, protokoll och styrande PM"
        >
          <span className="subnav-pill-icon" style={{ color: '#475569' }}>
            <LayersIcon size={16} />
          </span>
          <span className="subnav-pill-title">Rutiner/PM</span>
          <span className="subnav-pill-desc">Kliniska hubbar</span>
        </button>

        {/* Min Sida */}
        <button
          className={`subnav-pill-btn ${activeCategory === 'MY_PAGE' ? 'active' : ''}`}
          onClick={() => onSelectCategory('MY_PAGE')}
          title="Min Sida & Sparade Favoriter"
        >
          <span className="subnav-pill-icon" style={{ color: '#ca8a04' }}>
            <StarIcon filled size={16} />
          </span>
          <span className="subnav-pill-title">Min Sida</span>
          {favoritesCount > 0 && <span className="subnav-badge">{favoritesCount}</span>}
        </button>
      </div>
    </nav>
  );
};
