import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, MapPin, Layout,
    Sparkles, Type, AlignLeft, DollarSign, Clock, Check,
    Camera, Plus, Home, X, Navigation, Search, Maximize2, Minimize2
} from 'lucide-react';
import LocationPicker from '../components/Map/LocationPicker';
import SearchLocation from '../components/Map/SearchLocation';


const PublicationAnnonce = () => {
    const [step, setStep] = useState(1);
    const [images, setImages] = useState([]);
    const [typePublication, setTypePublication] = useState('');
    const [categorie, setCategorie] = useState('');
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [position, setPosition] = useState(null);
    const [mapPosition, setMapPosition] = useState([3.848, 11.502]);


    const [ville, setVille] = useState('');
    const [quartier, setQuartier] = useState('');
    const [region, setRegion] = useState('');

    const steps = [
        { id: 1, label: 'Description', icon: <Layout size={20} /> },
        { id: 2, label: 'Complément', icon: <Sparkles size={20} /> },
        { id: 3, label: 'Position', icon: <MapPin size={20} /> },
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImgs = files.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        setImages([...images, ...newImgs]);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    useEffect(() => {
        if (isMapExpanded) {

            document.body.style.overflow = 'hidden';
        } else {

            document.body.style.overflow = 'unset';
        }


        return () => { document.body.style.overflow = 'unset'; };
    }, [isMapExpanded]);

    return (
        <div className="min-h-screen bg-white flex flex-col w-full font-sans text-gray-900">

            {/* HEADER & STEPPER PROGRESSION */}

            <div className="bg-white w-full pt-10 pb-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-black text-[#1a2b3c] tracking-tight">
                            Publier une Annonce
                        </h1>
                        <div className="h-1 w-12 bg-[#f97316] mx-auto mt-2 rounded-full"></div>
                    </div>

                    <div className="relative flex justify-between items-end mb-4 px-4 sm:px-20">
                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center z-10">
                                <div className={`mb-2 transition-colors duration-300 ${step >= s.id ? 'text-[#007b83]' : 'text-gray-300'}`}>
                                    {s.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${step >= s.id ? 'text-[#007b83]' : 'text-gray-300'}`}>
                                    {s.label}
                                </span>
                                <div className={`w-3.5 h-3.5 rounded-full border-[3px] border-white shadow-sm transition-colors duration-300 ${step >= s.id ? 'bg-[#007b83]' : 'bg-gray-200'}`} />
                            </div>
                        ))}
                        <div className="absolute bottom-[6px] left-0 right-0 h-[2px] bg-gray-100 mx-10 sm:mx-32 -z-0" />
                        <div
                            className="absolute bottom-[6px] left-0 h-[2px] bg-[#007b83] transition-all duration-500 ease-in-out mx-10 sm:mx-32 -z-0"
                            style={{ width: `${((step - 1) / (steps.length - 0.5)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* CONTENU PRINCIPAL */}
            <div className="flex-1 w-full p-6 max-w-5xl mx-auto">

                {/* ETAPE 1 : DESCRIPTION */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2"><Type size={16} /> Titre du Bien</label>
                            <input type="text" placeholder="Studio moderne..." className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-colors" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2"><DollarSign size={16} /> Prix du loyer (FCFA)</label>
                            <input type="number" placeholder="150 000" className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2"><Clock size={16} /> Superficie (m²)</label>
                            <input type="number" placeholder="100" className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2"><Home size={16} /> Nombre de Pièces</label>
                            <input type="number" placeholder="5" className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83]" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold flex items-center gap-2"><AlignLeft size={16} /> Description</label>
                            <textarea rows="4" placeholder="Détails importants..." className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:border-[#007b83] resize-none"></textarea>
                        </div>
                    </div>
                )}

                {/* ETAPE 2 : COMPLÉMENTAIRE */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Photos du logement</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                {images.map((img, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-100 relative group">
                                        <img src={img.preview} className="w-full h-full object-cover" alt="" />
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                                    <Plus className="text-gray-400 group-hover:text-[#007b83]" size={24} />
                                    <input type="file" multiple className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Type de Publication</label>
                                <select
                                    value={typePublication}
                                    onChange={(e) => setTypePublication(e.target.value)}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choisir un type</option>
                                    <option value="louer">À Louer</option>
                                    <option value="vendre">À Vendre</option>
                                    <option value="nuitée">Par Nuitée</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Catégorie du Bien</label>
                                <select
                                    value={categorie}
                                    onChange={(e) => setCategorie(e.target.value)}
                                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Choisir une catégorie</option>
                                    <option value="chambre">Chambre</option>
                                    <option value="studio">Studio</option>
                                    <option value="appartement">Appartement</option>
                                    <option value="maison">Maison</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ETAPE 3 : POSITION */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Champs Ville et Quartier */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                                    <Navigation size={16} /> Region
                                </label>
                                <input
                                    type="text"
                                    value={region}
                                    onChange={(e) => setVille(e.target.value)}
                                    placeholder="Ex: Centre, Littoral..."
                                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                                    <Navigation size={16} /> Ville
                                </label>
                                <input
                                    type="text"
                                    value={ville}
                                    onChange={(e) => setVille(e.target.value)}
                                    placeholder="Ex: Yaoundé, Douala..."
                                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                                    <MapPin size={16} /> Quartier
                                </label>
                                <input
                                    type="text"
                                    value={quartier}
                                    onChange={(e) => setQuartier(e.target.value)}
                                    placeholder="Ex: Bastos, Bonapriso..."
                                    className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#007b83] transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Cadre de la Carte */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                                    Localisation précise (Cliquez sur la carte)
                                </h3>

                                <button
                                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                                    className={`flex items-center gap-2 text-[10px] font-bold transition-all ${isMapExpanded
                                        ? 'fixed top-6 right-6 z-[100001] bg-[#1a2b3c] text-white shadow-2xl px-6 py-3 rounded-2xl border border-white/10 hover:scale-105 active:scale-95'
                                        : 'relative z-10 text-[#007b83] hover:bg-teal-50 px-3 py-1.5 rounded-full'
                                        }`}
                                >
                                    {isMapExpanded ? <><Minimize2 size={14} /> QUITTER LE PLEIN ÉCRAN</> : <><Maximize2 size={14} /> PLEIN ÉCRAN</>}
                                </button>
                            </div>

                            {/* Barre de recherche - Adaptée pour le plein écran */}
                            <div className={`transition-all ${isMapExpanded ? 'fixed top-8 left-1/2 -translate-x-1/2 z-[100001] w-full max-w-md px-4' : 'relative z-30'}`}>
                                <SearchLocation setMapPosition={setMapPosition} />
                            </div>

                            {/* Conteneur de la Carte */}
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isMapExpanded
                                ? 'fixed inset-0 z-[100000] bg-white w-screen h-screen rounded-none'
                                : 'relative w-full aspect-video md:aspect-[21/9] rounded-[2.5rem] border-4 border-white shadow-xl shadow-gray-200/50'
                                }`}>

                                <LocationPicker
                                    setPosition={setPosition}
                                    mapPosition={mapPosition}
                                    isExpanded={isMapExpanded}
                                />

                                {/* Badge de Coordonnées (Temps Réel) */}
                                {position && (
                                    <div className={`absolute z-[100001] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white transition-all ${isMapExpanded
                                            ? 'bottom-10 right-10' // Positionné en bas à droite en plein écran
                                            : 'bottom-6 left-6'    // Positionné en bas à gauche en mode réduit
                                        }`}>
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Coordonnées</p>
                                        <code className="text-xs font-bold text-[#007b83] font-mono">
                                            {position.lat.toFixed(5)} , {position.lng.toFixed(5)}
                                        </code>
                                    </div>
                                )}
                            </div>

                            {!isMapExpanded && (
                                <p className="text-center text-[11px] text-gray-400 italic">
                                    Astuce : Recherchez votre quartier puis cliquez précisément sur l'emplacement du bien.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* NAVIGATION BAS DE PAGE */}
                <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft size={20} /> Précédent
                        </button>
                    ) : <div />}

                    <button
                        onClick={() => step < 3 ? setStep(step + 1) : alert("Publication en cours...")}
                        className="px-8 py-3 bg-[#007b83] text-white rounded-lg font-bold shadow-sm hover:bg-[#00666d] transition-all flex items-center gap-2"
                    >
                        {step === 3 ? (
                            <><Check size={20} /> TERMINER</>
                        ) : (
                            <>Suivant <ChevronRight size={20} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicationAnnonce;