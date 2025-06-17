import React from 'react';
import './PhoneBrandSelector.css';

interface PhoneBrand {
  id: string;
  name: string;
  imageUrl: string;
  models: string[];
}

const PHONE_BRANDS: PhoneBrand[] = [
  {
    id: 'apple',
    name: 'Apple',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    models: ['iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro', 'iPhone 14']
  },
  {
    id: 'samsung',
    name: 'Samsung',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    models: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy Z Fold 5']
  },
  {
    id: 'google',
    name: 'Google',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    models: ['Pixel 8 Pro', 'Pixel 8', 'Pixel 7a', 'Pixel Fold']
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg',
    models: ['Xiaomi 14 Pro', 'Xiaomi 14', 'Xiaomi 13T Pro', 'Xiaomi 13T']
  },
  {
    id: 'oneplus',
    name: 'OnePlus',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/OnePlus_logo_2015.svg',
    models: ['OnePlus 12', 'OnePlus 11', 'OnePlus Open', 'OnePlus Nord N30']
  }
];

interface PhoneBrandSelectorProps {
  onSelectModel: (model: string) => void;
}

const PhoneBrandSelector: React.FC<PhoneBrandSelectorProps> = ({ onSelectModel }) => {
  const [selectedBrand, setSelectedBrand] = React.useState<string | null>(null);

  return (
    <div className="phone-brand-selector">
      <div className="brand-grid">
        {PHONE_BRANDS.map((brand) => (
          <div
            key={brand.id}
            className={`brand-card ${selectedBrand === brand.id ? 'selected' : ''}`}
            onClick={() => setSelectedBrand(brand.id)}
          >
            <img src={brand.imageUrl} alt={brand.name} className="brand-logo" />
            <span className="brand-name">{brand.name}</span>
          </div>
        ))}
      </div>
      
      {selectedBrand && (
        <div className="model-list">
          <h4>Select {PHONE_BRANDS.find(b => b.id === selectedBrand)?.name} Model:</h4>
          <div className="model-grid">
            {PHONE_BRANDS.find(b => b.id === selectedBrand)?.models.map((model) => (
              <button
                key={model}
                className="model-button"
                onClick={() => onSelectModel(model)}
              >
                {model}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneBrandSelector; 