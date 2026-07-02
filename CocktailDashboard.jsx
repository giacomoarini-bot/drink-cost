import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Save, Wine, Clock, Search, Trash2, Droplets, Beaker, Citrus,
  Sparkles, Leaf, Candy, FlaskConical, ChevronDown, ChevronUp,
  Pencil, AlertCircle, TrendingUp, Euro, Percent, AlertTriangle, PieChart as PieIcon,
  Target, Receipt, X, Minus, Check, ListPlus, SlidersHorizontal, ArrowLeft,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

/* ---------- Types / constants ---------- */
const INGREDIENT_TYPE_LABELS = {
  spirit: 'Spirit', liqueur: 'Liquore', mixer: 'Mixer', garnish: 'Guarnizione',
  bitter: 'Bitter', syrup: 'Sciroppo', juice: 'Succo', other: 'Altro',
};
const INGREDIENT_TYPE_COLORS = {
  spirit: '#E31B23', liqueur: '#D4A574', mixer: '#34D399', garnish: '#FBBF24',
  bitter: '#8B5CF6', syrup: '#F472B6', juice: '#F97316', other: '#9CA3AF',
};
const PIE_COLORS = ['#E31B23', '#D4A574', '#34D399', '#FBBF24', '#8B5CF6', '#F472B6', '#F97316', '#9CA3AF'];
const INGREDIENT_TYPES = ['spirit', 'liqueur', 'bitter', 'juice', 'syrup', 'mixer', 'garnish', 'other'];
const BOTTLE_PRESETS = [50, 100, 200, 375, 500, 700, 750, 1000, 1500];

const TYPE_ICONS = {
  spirit: <Wine className="w-3.5 h-3.5" />,
  liqueur: <FlaskConical className="w-3.5 h-3.5" />,
  mixer: <Droplets className="w-3.5 h-3.5" />,
  garnish: <Leaf className="w-3.5 h-3.5" />,
  bitter: <Sparkles className="w-3.5 h-3.5" />,
  syrup: <Candy className="w-3.5 h-3.5" />,
  juice: <Citrus className="w-3.5 h-3.5" />,
  other: <Beaker className="w-3.5 h-3.5" />,
};

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const costFromBottle = (bottlePrice, bottleSizeMl) =>
  bottleSizeMl > 0 ? bottlePrice / (bottleSizeMl / 1000) : 0;

/* ---------- Seed data ---------- */
const DEFAULT_INGREDIENTS = [
  { id: 'ing-1', name: 'Gin London Dry', type: 'spirit', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 12.95, costPerLiter: costFromBottle(12.95, 700), stock: 1000, createdAt: now() },
  { id: 'ing-2', name: 'Vodka Premium', type: 'spirit', priceMode: 'bottle', bottleSizeMl: 1000, bottlePrice: 15.0, costPerLiter: 15.0, stock: 1000, createdAt: now() },
  { id: 'ing-3', name: 'Rum Bianco', type: 'spirit', priceMode: 'bottle', bottleSizeMl: 1000, bottlePrice: 12.0, costPerLiter: 12.0, stock: 1000, createdAt: now() },
  { id: 'ing-4', name: 'Rum Scuro', type: 'spirit', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 15.4, costPerLiter: costFromBottle(15.4, 700), stock: 1000, createdAt: now() },
  { id: 'ing-5', name: 'Tequila Blanco', type: 'spirit', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 19.6, costPerLiter: costFromBottle(19.6, 700), stock: 1000, createdAt: now() },
  { id: 'ing-6', name: 'Whiskey Bourbon', type: 'spirit', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 17.5, costPerLiter: costFromBottle(17.5, 700), stock: 1000, createdAt: now() },
  { id: 'ing-7', name: 'Triple Sec', type: 'liqueur', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 9.8, costPerLiter: costFromBottle(9.8, 700), stock: 1000, createdAt: now() },
  { id: 'ing-8', name: 'Vermouth Rosso', type: 'liqueur', priceMode: 'bottle', bottleSizeMl: 1000, bottlePrice: 10.0, costPerLiter: 10.0, stock: 1000, createdAt: now() },
  { id: 'ing-9', name: 'Campari', type: 'bitter', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 11.55, costPerLiter: costFromBottle(11.55, 700), stock: 1000, createdAt: now() },
  { id: 'ing-10', name: 'Aperol', type: 'bitter', priceMode: 'bottle', bottleSizeMl: 700, bottlePrice: 9.1, costPerLiter: costFromBottle(9.1, 700), stock: 1000, createdAt: now() },
  { id: 'ing-11', name: 'Succo Limone', type: 'juice', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 4.5, stock: 2000, createdAt: now() },
  { id: 'ing-12', name: 'Succo Lime', type: 'juice', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 5.0, stock: 2000, createdAt: now() },
  { id: 'ing-13', name: 'Sciroppo Zucchero', type: 'syrup', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 3.5, stock: 2000, createdAt: now() },
  { id: 'ing-14', name: 'Acqua Tonica', type: 'mixer', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 2.5, stock: 3000, createdAt: now() },
  { id: 'ing-15', name: 'Soda', type: 'mixer', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 1.5, stock: 3000, createdAt: now() },
  { id: 'ing-16', name: 'Coca Cola', type: 'mixer', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 2.0, stock: 3000, createdAt: now() },
  { id: 'ing-17', name: 'Scorza Limone', type: 'garnish', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 8.0, stock: 500, createdAt: now() },
  { id: 'ing-18', name: 'Oliva', type: 'garnish', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 12.0, stock: 500, createdAt: now() },
  { id: 'ing-19', name: 'Menta Fresca', type: 'garnish', priceMode: 'liter', bottleSizeMl: null, bottlePrice: null, costPerLiter: 15.0, stock: 500, createdAt: now() },
];

const DEFAULT_COCKTAILS = [
  {
    id: 'c-1', name: 'Negroni', description: "Classico cocktail italiano, perfetto per l'aperitivo",
    recipeItems: [
      { ingredientId: 'ing-1', volumeCl: 3.0, calculatedCost: (3 / 100) * costFromBottle(12.95, 700) },
      { ingredientId: 'ing-9', volumeCl: 3.0, calculatedCost: (3 / 100) * costFromBottle(11.55, 700) },
      { ingredientId: 'ing-8', volumeCl: 3.0, calculatedCost: 0.30 },
    ], profitMargin: 150, vatRate: 22, createdAt: now(), updatedAt: now(),
  },
  {
    id: 'c-2', name: 'Mojito', description: 'Rinfrescante cocktail cubano con menta e lime',
    recipeItems: [
      { ingredientId: 'ing-3', volumeCl: 5.0, calculatedCost: 0.60 },
      { ingredientId: 'ing-12', volumeCl: 2.5, calculatedCost: 0.13 },
      { ingredientId: 'ing-13', volumeCl: 2.0, calculatedCost: 0.07 },
      { ingredientId: 'ing-15', volumeCl: 3.0, calculatedCost: 0.05 },
      { ingredientId: 'ing-19', volumeCl: 1.0, calculatedCost: 0.15 },
    ], profitMargin: 130, vatRate: 22, createdAt: now(), updatedAt: now(),
  },
  {
    id: 'c-3', name: 'Margarita', description: 'Il re dei cocktail messicani',
    recipeItems: [
      { ingredientId: 'ing-5', volumeCl: 5.0, calculatedCost: (5 / 100) * costFromBottle(19.6, 700) },
      { ingredientId: 'ing-7', volumeCl: 2.5, calculatedCost: (2.5 / 100) * costFromBottle(9.8, 700) },
      { ingredientId: 'ing-12', volumeCl: 2.0, calculatedCost: 0.10 },
    ], profitMargin: 140, vatRate: 22, createdAt: now(), updatedAt: now(),
  },
];

const DEFAULT_SETTINGS = { defaultProfitMargin: 120, defaultVatRate: 22 };

/* ---------- Store ---------- */
function useCocktailStore() {
  const [ingredients, setIngredients] = useState(DEFAULT_INGREDIENTS);
  const [cocktails, setCocktails] = useState(DEFAULT_COCKTAILS);
  const [settings] = useState(DEFAULT_SETTINGS);
  const [selectedCocktailId, setSelectedCocktailId] = useState('c-1');

  const addIngredient = useCallback((ing) => {
    const id = `ing-${uid()}`;
    setIngredients((s) => [...s, { ...ing, id, createdAt: now() }]);
    return id;
  }, []);

  const updateIngredient = useCallback((id, updates) => {
    setIngredients((s) => s.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    // keep recipe item costs in sync with the new price
    setCocktails((cs) => cs.map((c) => ({
      ...c,
      recipeItems: c.recipeItems.map((r) => {
        if (r.ingredientId !== id) return r;
        const newCost = updates.costPerLiter != null ? updates.costPerLiter : null;
        return newCost != null ? { ...r, calculatedCost: (r.volumeCl / 100) * newCost } : r;
      }),
    })));
  }, []);

  const deleteIngredient = useCallback((id) => {
    setIngredients((s) => s.filter((i) => i.id !== id));
    setCocktails((s) => s.map((c) => ({ ...c, recipeItems: c.recipeItems.filter((r) => r.ingredientId !== id) })));
  }, []);

  const addCocktail = useCallback((c) => {
    const id = `c-${uid()}`;
    setCocktails((s) => [...s, { ...c, id, createdAt: now(), updatedAt: now() }]);
    setSelectedCocktailId(id);
    return id;
  }, []);

  const updateCocktail = useCallback((id, updates) => {
    setCocktails((s) => s.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: now() } : c)));
  }, []);

  const deleteCocktail = useCallback((id) => {
    setCocktails((s) => s.filter((c) => c.id !== id));
    setSelectedCocktailId((cur) => (cur === id ? null : cur));
  }, []);

  const addRecipeItem = useCallback((cocktailId, ingredientId, volumeCl = 4.5) => {
    setIngredients((ings) => {
      const ing = ings.find((i) => i.id === ingredientId);
      if (ing) {
        setCocktails((cs) => cs.map((c) => {
          if (c.id !== cocktailId) return c;
          const existing = c.recipeItems.find((r) => r.ingredientId === ingredientId);
          if (existing) {
            return {
              ...c, updatedAt: now(),
              recipeItems: c.recipeItems.map((r) => r.ingredientId === ingredientId
                ? { ...r, volumeCl: r.volumeCl + volumeCl, calculatedCost: ((r.volumeCl + volumeCl) / 100) * ing.costPerLiter }
                : r),
            };
          }
          return {
            ...c, updatedAt: now(),
            recipeItems: [...c.recipeItems, { ingredientId, volumeCl, calculatedCost: (volumeCl / 100) * ing.costPerLiter }],
          };
        }));
      }
      return ings;
    });
  }, []);

  const updateRecipeItem = useCallback((cocktailId, ingredientId, volumeCl) => {
    setIngredients((ings) => {
      const ing = ings.find((i) => i.id === ingredientId);
      if (ing) {
        setCocktails((cs) => cs.map((c) => c.id === cocktailId ? {
          ...c, updatedAt: now(),
          recipeItems: c.recipeItems.map((r) => r.ingredientId === ingredientId
            ? { ...r, volumeCl, calculatedCost: (volumeCl / 100) * ing.costPerLiter } : r),
        } : c));
      }
      return ings;
    });
  }, []);

  const removeRecipeItem = useCallback((cocktailId, ingredientId) => {
    setCocktails((cs) => cs.map((c) => c.id === cocktailId
      ? { ...c, updatedAt: now(), recipeItems: c.recipeItems.filter((r) => r.ingredientId !== ingredientId) } : c));
  }, []);

  const calculateCocktailCost = useCallback((cocktailId) => {
    const c = cocktails.find((x) => x.id === cocktailId);
    if (!c) return { totalCost: 0, totalVolume: 0, portions: 1 };
    let totalCost = 0, totalVolume = 0;
    c.recipeItems.forEach((it) => { totalCost += it.calculatedCost; totalVolume += it.volumeCl; });
    return { totalCost, totalVolume, portions: 1 };
  }, [cocktails]);

  const calculatePricing = useCallback((cocktailId) => {
    const c = cocktails.find((x) => x.id === cocktailId);
    if (!c) return { costPerPortion: 0, targetPrice: 0, finalPrice: 0, marginWarning: false };
    const { totalCost } = calculateCocktailCost(cocktailId);
    const costPerPortion = totalCost;
    const targetPrice = costPerPortion * (1 + c.profitMargin / 100);
    const finalPrice = targetPrice * (1 + c.vatRate / 100);
    return { costPerPortion, targetPrice, finalPrice, marginWarning: c.profitMargin < 100 };
  }, [cocktails, calculateCocktailCost]);

  return {
    ingredients, cocktails, settings, selectedCocktailId,
    setSelectedCocktailId, addIngredient, updateIngredient, deleteIngredient, addCocktail, updateCocktail,
    deleteCocktail, addRecipeItem, updateRecipeItem, removeRecipeItem,
    calculateCocktailCost, calculatePricing,
  };
}

/* ---------- Liquid animated background ---------- */
function LiquidBackground() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const blobs = [
      { phase: 0, speed: 0.002, radius: 0.6 },
      { phase: 2.1, speed: 0.0015, radius: 0.5 },
      { phase: 4.2, speed: 0.001, radius: 0.7 },
    ];
    const animate = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'screen';
      blobs.forEach((b) => {
        const x = canvas.width * (0.5 + 0.3 * Math.sin(t * b.speed + b.phase));
        const y = canvas.height * (0.5 + 0.2 * Math.sin(t * b.speed * 1.3 + b.phase));
        const r = Math.min(canvas.width, canvas.height) * b.radius;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(227,27,35,0.04)');
        g.addColorStop(0.5, 'rgba(227,27,35,0.02)');
        g.addColorStop(1, 'rgba(227,27,35,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />;
}

/* ---------- Top Navigation ---------- */
function TopNavigation({ onNewDrink }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const up = () => setTime(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
    up();
    const i = setInterval(up, 1000);
    return () => clearInterval(i);
  }, []);
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 lg:h-20 z-50 flex items-center justify-between px-4 lg:px-10"
      style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.85) 65%, transparent 100%)' }}>
      <div className="flex items-center gap-2.5">
        <Wine className="w-6 h-6 lg:w-7 lg:h-7 text-[#E31B23]" />
        <h1 className="font-editorial text-xl lg:text-3xl italic text-[#F4F4F0] tracking-wide">Mixology Maestro</h1>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <button onClick={onNewDrink}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-[#E31B23] text-white hover:bg-[#c41820] active:scale-95 transition-all duration-150">
          <Plus className="w-4 h-4" /><span>Nuovo Drink</span>
        </button>
      </div>
      <div className="flex items-center gap-1.5 text-[#A8A29E]">
        <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4" /><span className="text-xs lg:text-sm font-mono tabular-nums">{time}</span>
      </div>
    </nav>
  );
}

/* ---------- Bottom Tab Bar (mobile) ---------- */
function BottomTabBar({ active, onChange, onQuickAdd }) {
  const tabs = [
    { id: 'inventory', label: 'Inventario', icon: Wine },
    { id: 'builder', label: 'Drink', icon: FlaskConical },
    { id: 'analysis', label: 'Analisi', icon: PieIcon },
  ];
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1">
      <div className="flex items-center gap-1 rounded-[28px] px-2 py-2"
        style={{ background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(244,244,240,0.08)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-3xl transition-all duration-200"
              style={{ minHeight: 48 }}>
              <Icon className="w-5 h-5" style={{ color: isActive ? '#E31B23' : '#A8A29E' }} />
              <span className="text-[10px] font-medium" style={{ color: isActive ? '#F4F4F0' : '#A8A29E' }}>{t.label}</span>
            </button>
          );
        })}
        <button onClick={onQuickAdd}
          className="w-12 h-12 rounded-full bg-[#E31B23] text-white flex items-center justify-center shrink-0 active:scale-90 transition-transform duration-150"
          style={{ boxShadow: '0 4px 16px rgba(227,27,35,0.4)' }}>
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Segmented control ---------- */
function Segmented({ options, value, onChange }) {
  return (
    <div className="flex p-1 rounded-2xl bg-white/[0.05] border border-white/[0.06]">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{
            background: value === o.value ? '#E31B23' : 'transparent',
            color: value === o.value ? '#fff' : '#A8A29E',
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Ingredient row (shared) ---------- */
function IngredientRow({ ing, onTap, onEdit, onDelete, trailing }) {
  return (
    <div onClick={onTap}
      className="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-150 active:bg-white/[0.06] hover:bg-white/[0.05]"
      style={{ minHeight: 60 }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${INGREDIENT_TYPE_COLORS[ing.type]}22`, color: INGREDIENT_TYPE_COLORS[ing.type] }}>
        {TYPE_ICONS[ing.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#F4F4F0] truncate">{ing.name}</p>
        <p className="text-xs text-[#A8A29E]">
          {INGREDIENT_TYPE_LABELS[ing.type]} · €{ing.costPerLiter.toFixed(2)}/L
          {ing.priceMode === 'bottle' && ing.bottleSizeMl ? ` · bott. ${ing.bottleSizeMl}ml €${ing.bottlePrice?.toFixed(2)}` : ''}
        </p>
      </div>
      {trailing || (
        <div className="flex items-center gap-0.5 shrink-0">
          {onEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(ing); }}
              className="p-2 rounded-xl text-[#A8A29E] hover:text-[#F4F4F0] hover:bg-white/[0.08] transition-all" style={{ minWidth: 36, minHeight: 36 }}>
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); if (confirm(`Eliminare ${ing.name}?`)) onDelete(ing.id); }}
              className="p-2 rounded-xl text-[#A8A29E] hover:text-[#E31B23] hover:bg-[#E31B23]/10 transition-all" style={{ minWidth: 36, minHeight: 36 }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Ingredient Panel (Inventory tab) ---------- */
function IngredientPanel({ store, onAddIngredient, onEditIngredient }) {
  const { ingredients, selectedCocktailId, addRecipeItem, deleteIngredient } = store;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = ingredients.filter((ing) => {
    const s = ing.name.toLowerCase().includes(searchTerm.toLowerCase());
    const t = filterType === 'all' || ing.type === filterType;
    return s && t;
  });

  const handleAdd = (id) => {
    if (!selectedCocktailId) { alert('Seleziona prima un cocktail nella tab Drink!'); return; }
    addRecipeItem(selectedCocktailId, id, 4.5);
  };

  return (
    <div className="glass-surface rounded-3xl h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-lg font-semibold text-[#F4F4F0] flex items-center gap-2">
            <Wine className="w-5 h-5 text-[#E31B23]" />Inventario
          </h2>
          <button onClick={onAddIngredient} title="Aggiungi Prodotto"
            className="w-10 h-10 rounded-full bg-[#E31B23] text-white hover:bg-[#c41820] transition-colors flex items-center justify-center active:scale-90">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
          <input type="text" placeholder="Cerca ingrediente..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F4F4F0] placeholder-[#A8A29E] focus:outline-none focus:border-[#E31B23] transition-all" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <FilterChip active={filterType === 'all'} onClick={() => setFilterType('all')}>Tutti</FilterChip>
          {INGREDIENT_TYPES.map((t) => (
            <FilterChip key={t} active={filterType === t} onClick={() => setFilterType(t)}>{INGREDIENT_TYPE_LABELS[t]}</FilterChip>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {filtered.map((ing) => (
          <IngredientRow key={ing.id} ing={ing}
            onTap={() => handleAdd(ing.id)}
            onEdit={onEditIngredient}
            onDelete={deleteIngredient} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <Beaker className="w-10 h-10 text-[#A8A29E] mx-auto mb-3 opacity-40" />
            <p className="text-sm text-[#A8A29E]">Nessun ingrediente trovato</p>
          </div>
        )}
      </div>
      {selectedCocktailId && (
        <div className="px-4 py-2.5 border-t border-white/[0.06] text-center">
          <p className="text-xs text-[#A8A29E]">Tocca un ingrediente per aggiungerlo al drink selezionato</p>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0"
      style={{ background: active ? '#E31B23' : 'rgba(244,244,240,0.05)', color: active ? '#fff' : '#A8A29E' }}>
      {children}
    </button>
  );
}

/* ---------- Cocktail List ---------- */
function CocktailList({ store, onNewCocktail }) {
  const { cocktails, selectedCocktailId, setSelectedCocktailId, calculatePricing, calculateCocktailCost } = store;
  return (
    <div className="glass-surface rounded-3xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#F4F4F0] flex items-center gap-2">
          <Wine className="w-4 h-4 text-[#E31B23]" />I Tuoi Drink
        </h3>
        <button onClick={onNewCocktail} title="Nuovo Cocktail"
          className="p-2 rounded-full text-[#A8A29E] hover:text-[#E31B23] hover:bg-[#E31B23]/10 transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-[220px] overflow-y-auto p-2 space-y-1">
        {cocktails.map((c) => {
          const sel = c.id === selectedCocktailId;
          const p = calculatePricing(c.id);
          const cd = calculateCocktailCost(c.id);
          return (
            <button key={c.id} onClick={() => setSelectedCocktailId(c.id)}
              className="w-full text-left p-3 rounded-2xl transition-all duration-150"
              style={{ background: sel ? 'rgba(227,27,35,0.15)' : 'transparent', border: sel ? '1px solid rgba(227,27,35,0.3)' : '1px solid transparent', minHeight: 56 }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: sel ? '#E31B23' : '#F4F4F0' }}>{c.name}</p>
                  <p className="text-xs text-[#A8A29E]">{c.recipeItems.length} ingredienti · {cd.totalVolume.toFixed(1)} cl</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-semibold text-[#F4F4F0] tabular-nums">€{p.finalPrice.toFixed(2)}</p>
                  <p className="text-xs text-[#34D399] tabular-nums">+{c.profitMargin}%</p>
                </div>
              </div>
            </button>
          );
        })}
        {cocktails.length === 0 && (
          <div className="text-center py-6">
            <Wine className="w-8 h-8 text-[#A8A29E] mx-auto mb-2 opacity-30" />
            <p className="text-xs text-[#A8A29E]">Nessun cocktail</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Glass Visualizer ---------- */
function GlassVisualizer({ store, recipeItems, totalVolume }) {
  const { ingredients } = store;
  const maxVolume = Math.max(totalVolume, 15);
  const fillPercentage = Math.min((totalVolume / maxVolume) * 100, 100);
  const y = 120 - (fillPercentage / 100) * 90 - 10;
  return (
    <div className="relative w-28 h-36 lg:w-32 lg:h-40">
      <svg viewBox="0 0 100 120" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(227,27,35,0.15))' }}>
        <defs>
          <clipPath id="glass-clip">
            <path d="M10 30 Q10 80 25 90 L25 100 L15 105 L15 110 L85 110 L85 105 L75 100 L75 90 Q90 80 90 30 Z" />
          </clipPath>
          <linearGradient id="liquid-gradient" x1="0" y1="1" x2="0" y2="0">
            {recipeItems.map((item, i) => {
              const ing = ingredients.find((g) => g.id === item.ingredientId);
              if (!ing || totalVolume === 0) return null;
              const offset = recipeItems.slice(0, i).reduce((s, r) => s + r.volumeCl, 0) / totalVolume;
              return <stop key={item.ingredientId} offset={`${offset * fillPercentage}%`} stopColor={INGREDIENT_TYPE_COLORS[ing.type]} />;
            })}
            <stop offset="100%" stopColor="#E31B23" />
          </linearGradient>
        </defs>
        <g clipPath="url(#glass-clip)">
          <rect x="0" y={`${y}`} width="100" height="100" fill="url(#liquid-gradient)" opacity="0.7">
            <animate attributeName="y" from="120" to={`${y}`} dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
          </rect>
          <line x1="10" y1={`${y}`} x2="90" y2={`${y}`} stroke="rgba(244,244,240,0.3)" strokeWidth="0.5" />
        </g>
        <path d="M10 30 Q10 80 25 90 L25 100 L15 105 L15 110 L85 110 L85 105 L75 100 L75 90 Q90 80 90 30 Z"
          fill="none" stroke="rgba(244,244,240,0.15)" strokeWidth="1.5" />
        <line x1="20" y1="50" x2="30" y2="50" stroke="rgba(244,244,240,0.1)" strokeWidth="0.5" />
        <line x1="20" y1="65" x2="30" y2="65" stroke="rgba(244,244,240,0.1)" strokeWidth="0.5" />
        <line x1="20" y1="80" x2="30" y2="80" stroke="rgba(244,244,240,0.1)" strokeWidth="0.5" />
      </svg>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-center">
        <span className="text-xs text-[#A8A29E] font-mono">{totalVolume.toFixed(1)} cl</span>
      </div>
    </div>
  );
}

/* ---------- Cocktail Builder (Drink tab) ---------- */
function CocktailBuilder({ store, onNewCocktail, onEditCocktail }) {
  const { cocktails, selectedCocktailId, ingredients, updateRecipeItem, removeRecipeItem, deleteCocktail, calculateCocktailCost } = store;
  const [expandedItem, setExpandedItem] = useState(null);

  const selected = cocktails.find((c) => c.id === selectedCocktailId);
  const costData = selectedCocktailId ? calculateCocktailCost(selectedCocktailId) : { totalCost: 0, totalVolume: 0 };

  const step = (id, delta) => {
    const item = selected.recipeItems.find((r) => r.ingredientId === id);
    if (!item) return;
    updateRecipeItem(selected.id, id, Math.max(0.5, +(item.volumeCl + delta).toFixed(1)));
  };

  if (!selected) {
    return (
      <div className="glass-surface rounded-3xl h-full flex items-center justify-center">
        <div className="text-center px-6">
          <Wine className="w-16 h-16 text-[#A8A29E] mx-auto mb-4 opacity-30" />
          <p className="text-lg text-[#A8A29E] font-editorial italic">Seleziona un cocktail</p>
          <p className="text-sm text-[#A8A29E] mt-1 opacity-60">o creane uno nuovo</p>
          <button onClick={onNewCocktail} className="mt-5 px-6 py-3 rounded-full text-sm font-medium bg-[#E31B23] text-white hover:bg-[#c41820] active:scale-95 transition-all" style={{ minHeight: 44 }}>
            Crea il tuo primo drink
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-3xl h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl lg:text-2xl font-semibold text-[#F4F4F0] font-editorial truncate">{selected.name}</h2>
            {selected.description && <p className="text-sm text-[#A8A29E] mt-1 truncate">{selected.description}</p>}
          </div>
          <div className="flex items-center gap-1 ml-3 shrink-0">
            <button onClick={() => onEditCocktail(selected.id)} title="Modifica"
              className="p-2.5 rounded-full text-[#A8A29E] hover:text-[#F4F4F0] hover:bg-white/[0.06] transition-all" style={{ minWidth: 44, minHeight: 44 }}>
              <Pencil className="w-4 h-4 mx-auto" />
            </button>
            <button onClick={() => { if (confirm(`Eliminare "${selected.name}"?`)) deleteCocktail(selected.id); }} title="Elimina"
              className="p-2.5 rounded-full text-[#A8A29E] hover:text-[#E31B23] hover:bg-[#E31B23]/10 transition-all" style={{ minWidth: 44, minHeight: 44 }}>
              <Trash2 className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          <Stat color="#34D399" label={`${selected.recipeItems.length} ingredienti`} />
          <Stat color="#D4A574" label={`Volume: ${costData.totalVolume.toFixed(1)} cl`} />
          <Stat color="#E31B23" label={`Costo: €${costData.totalCost.toFixed(2)}`} />
        </div>
      </div>

      <div className="px-6 py-4 flex justify-center">
        <GlassVisualizer store={store} recipeItems={selected.recipeItems} totalVolume={costData.totalVolume} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-4">
        {selected.recipeItems.map((item) => {
          const ing = ingredients.find((i) => i.id === item.ingredientId);
          if (!ing) return null;
          const isExp = expandedItem === item.ingredientId;
          const pct = costData.totalVolume > 0 ? (item.volumeCl / costData.totalVolume) * 100 : 0;
          return (
            <div key={item.ingredientId} className="mb-2">
              <div onClick={() => setExpandedItem(isExp ? null : item.ingredientId)}
                className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-150 border"
                style={{ background: isExp ? 'rgba(244,244,240,0.06)' : 'transparent', borderColor: isExp ? 'rgba(227,27,35,0.2)' : 'transparent', minHeight: 60 }}>
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: INGREDIENT_TYPE_COLORS[ing.type] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F4F4F0] truncate">{ing.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#A8A29E]">{INGREDIENT_TYPE_LABELS[ing.type]}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: INGREDIENT_TYPE_COLORS[ing.type] }} />
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[#F4F4F0] tabular-nums">{item.volumeCl.toFixed(1)} cl</p>
                  <p className="text-xs text-[#34D399] tabular-nums">€{item.calculatedCost.toFixed(2)}</p>
                </div>
                {isExp ? <ChevronUp className="w-4 h-4 text-[#A8A29E] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#A8A29E] shrink-0" />}
              </div>
              {isExp && (
                <div className="px-3 pb-3 pt-2">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={(e) => { e.stopPropagation(); step(item.ingredientId, -0.5); }}
                      className="w-11 h-11 rounded-full bg-white/[0.08] text-[#F4F4F0] flex items-center justify-center active:scale-90 transition-transform">
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-center min-w-[80px]">
                      <p className="text-lg font-semibold text-[#F4F4F0] tabular-nums">{item.volumeCl.toFixed(1)} cl</p>
                      <p className="text-[11px] text-[#A8A29E]">{(item.volumeCl * 10).toFixed(0)} ml</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); step(item.ingredientId, 0.5); }}
                      className="w-11 h-11 rounded-full bg-white/[0.08] text-[#F4F4F0] flex items-center justify-center active:scale-90 transition-transform">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeRecipeItem(selected.id, item.ingredientId); }}
                      className="w-11 h-11 rounded-full text-[#A8A29E] hover:text-[#E31B23] hover:bg-[#E31B23]/10 flex items-center justify-center transition-all ml-auto">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/[0.06] flex justify-between text-xs text-[#A8A29E]">
                    <span>Costo/L: €{ing.costPerLiter.toFixed(2)}</span>
                    <span>Costo totale: €{item.calculatedCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {selected.recipeItems.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-[#A8A29E] mx-auto mb-3 opacity-40" />
            <p className="text-sm text-[#A8A29E]">Nessun ingrediente ancora</p>
            <button onClick={() => onEditCocktail(selected.id)} className="mt-3 px-4 py-2.5 rounded-full text-sm font-medium bg-white/[0.08] text-[#F4F4F0] hover:bg-white/[0.12] transition-all inline-flex items-center gap-2">
              <ListPlus className="w-4 h-4" />Aggiungi ingredienti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#A8A29E]">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} /><span>{label}</span>
    </div>
  );
}

/* ---------- Cost Analysis ---------- */
function CostAnalysis({ store }) {
  const { cocktails, selectedCocktailId, ingredients, updateCocktail, calculateCocktailCost, calculatePricing } = store;
  const selected = cocktails.find((c) => c.id === selectedCocktailId);

  if (!selected) {
    return (
      <div className="glass-surface rounded-3xl h-full flex items-center justify-center">
        <div className="text-center px-6">
          <PieIcon className="w-12 h-12 text-[#A8A29E] mx-auto mb-3 opacity-30" />
          <p className="text-sm text-[#A8A29E]">Seleziona un cocktail per vedere l'analisi</p>
        </div>
      </div>
    );
  }

  const costData = calculateCocktailCost(selected.id);
  const pricing = calculatePricing(selected.id);
  const marginWarning = pricing.marginWarning;

  const pieData = selected.recipeItems.map((item, i) => {
    const ing = ingredients.find((g) => g.id === item.ingredientId);
    return { name: ing?.name || 'Sconosciuto', value: item.calculatedCost, color: PIE_COLORS[i % PIE_COLORS.length] };
  });

  const setMargin = (v) => updateCocktail(selected.id, { profitMargin: Math.max(0, Math.min(500, v)) });
  const setVat = (v) => updateCocktail(selected.id, { vatRate: Math.max(0, Math.min(100, v)) });

  return (
    <div className="glass-surface rounded-3xl h-full flex flex-col overflow-hidden">
      <div className="p-4 lg:p-5 border-b border-white/[0.06]">
        <h2 className="text-lg font-semibold text-[#F4F4F0] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#E31B23]" />Analisi Costi
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={<Receipt className="w-4 h-4" />} label="Costo Totale" value={`€${costData.totalCost.toFixed(2)}`} color="#E31B23" />
          <MetricCard icon={<Euro className="w-4 h-4" />} label="Costo/Drink" value={`€${pricing.costPerPortion.toFixed(2)}`} color="#D4A574" />
          <MetricCard icon={<Target className="w-4 h-4" />} label="Prezzo Netto" value={`€${pricing.targetPrice.toFixed(2)}`} color="#34D399" />
          <MetricCard icon={<TrendingUp className="w-4 h-4" />} label="Prezzo Finale (IVA)" value={`€${pricing.finalPrice.toFixed(2)}`} color="#FBBF24" warning={marginWarning} />
        </div>

        {marginWarning && (
          <div className="p-3.5 rounded-2xl bg-[#FBBF24]/[0.08] border border-[#FBBF24]/20 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-[#FBBF24]">Margine basso</p>
              <p className="text-xs text-[#A8A29E] mt-0.5">Il margine di guadagno è inferiore al 100%. Considera di aumentarlo.</p>
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[#F4F4F0] flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#E31B23]" />Margine di Guadagno
            </label>
            <span className="text-sm font-semibold tabular-nums" style={{ color: marginWarning ? '#FBBF24' : '#34D399' }}>{selected.profitMargin}%</span>
          </div>
          <input type="range" min="0" max="500" step="5" value={selected.profitMargin} onChange={(e) => setMargin(parseInt(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-[#A8A29E] mt-1"><span>0%</span><span>250%</span><span>500%</span></div>
          <div className="mt-2.5 flex items-center gap-2">
            <input type="number" min="0" max="500" value={selected.profitMargin} onChange={(e) => setMargin(parseInt(e.target.value) || 0)}
              className="w-20 bg-white/[0.06] border border-white/10 rounded-xl px-2 py-2 text-sm text-[#F4F4F0] text-center focus:outline-none focus:border-[#E31B23] tabular-nums" />
            <span className="text-xs text-[#A8A29E]">%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[#F4F4F0] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#8B5CF6]" />Aliquota IVA
            </label>
            <span className="text-sm font-semibold text-[#8B5CF6] tabular-nums">{selected.vatRate}%</span>
          </div>
          <input type="range" min="0" max="50" step="1" value={selected.vatRate} onChange={(e) => setVat(parseInt(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-[#A8A29E] mt-1"><span>0%</span><span>22%</span><span>50%</span></div>
        </div>

        {pieData.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <h3 className="text-sm font-medium text-[#F4F4F0] mb-3">Composizione Costi</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#181818', border: '1px solid rgba(244,244,240,0.1)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(v) => `€${v.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {pieData.map((item) => {
                const p = costData.totalCost > 0 ? (item.value / costData.totalCost) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[#F4F4F0] truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#A8A29E] tabular-nums">{p.toFixed(1)}%</span>
                      <span className="text-[#A8A29E] tabular-nums">€{item.value.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
          <h3 className="text-sm font-medium text-[#F4F4F0] mb-2">Riepilogo</h3>
          <Row label="Volume totale" value={`${costData.totalVolume.toFixed(1)} cl`} />
          <Row label="Ingredienti" value={selected.recipeItems.length} />
          <Row label="Costo per ml" value={`€${costData.totalVolume > 0 ? (costData.totalCost / (costData.totalVolume * 10)).toFixed(4) : '0.0000'}`} />
          <div className="border-t border-white/[0.06] pt-2 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#A8A29E]">Guadagno netto/drink</span>
              <span className="text-[#34D399] font-medium tabular-nums">€{(pricing.targetPrice - pricing.costPerPortion).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-[#A8A29E]">{label}</span>
      <span className="text-[#F4F4F0] tabular-nums">{value}</span>
    </div>
  );
}

function MetricCard({ icon, label, value, color, warning = false }) {
  return (
    <div className="p-3.5 rounded-2xl bg-white/[0.03] border" style={{ borderColor: warning ? 'rgba(251,191,36,0.3)' : 'rgba(244,244,240,0.06)' }}>
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color }}>{icon}<span className="text-xs font-medium">{label}</span></div>
      <p className="text-lg font-bold tabular-nums" style={{ color: warning ? '#FBBF24' : '#F4F4F0' }}>{value}</p>
    </div>
  );
}

/* ---------- Bottom Sheet shell ---------- */
function Sheet({ open, onClose, children, title, icon, footer, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }} onClick={onClose}>
      <div className={`glass-surface-solid w-full ${wide ? 'sm:max-w-lg' : 'sm:max-w-md'} rounded-t-[28px] sm:rounded-[28px] overflow-hidden flex flex-col`}
        style={{ maxHeight: '92vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] shrink-0">
          <h3 className="text-base font-semibold text-[#F4F4F0] flex items-center gap-2">{icon}{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-full text-[#A8A29E] hover:text-[#F4F4F0] hover:bg-white/[0.08] flex items-center justify-center transition-all">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-4 border-t border-white/[0.06] shrink-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>{footer}</div>}
      </div>
    </div>
  );
}

const inputCls = "w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3 text-[15px] text-[#F4F4F0] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#E31B23] transition-all";
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#A8A29E] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

/* ---------- Add / Edit Ingredient Sheet ---------- */
function IngredientSheet({ open, onClose, onSave, editing }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('spirit');
  const [priceMode, setPriceMode] = useState('bottle');
  const [bottleSizeMl, setBottleSizeMl] = useState(700);
  const [customBottle, setCustomBottle] = useState('');
  const [bottlePrice, setBottlePrice] = useState('');
  const [costPerLiter, setCostPerLiter] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setType(editing.type);
      setPriceMode(editing.priceMode || 'liter');
      setBottleSizeMl(editing.bottleSizeMl || 700);
      setCustomBottle(BOTTLE_PRESETS.includes(editing.bottleSizeMl) ? '' : String(editing.bottleSizeMl || ''));
      setBottlePrice(editing.bottlePrice != null ? String(editing.bottlePrice) : '');
      setCostPerLiter(String(editing.costPerLiter || ''));
    } else {
      setName(''); setType('spirit'); setPriceMode('bottle'); setBottleSizeMl(700);
      setCustomBottle(''); setBottlePrice(''); setCostPerLiter('');
    }
  }, [open, editing]);

  const effectiveBottleSize = customBottle ? parseFloat(customBottle) : bottleSizeMl;
  const derivedCostPerLiter = priceMode === 'bottle'
    ? costFromBottle(parseFloat(bottlePrice) || 0, effectiveBottleSize || 0)
    : parseFloat(costPerLiter) || 0;

  const submit = () => {
    if (!name.trim()) return;
    if (priceMode === 'bottle' && (!bottlePrice || !effectiveBottleSize)) return;
    if (priceMode === 'liter' && !costPerLiter) return;

    const payload = {
      name: name.trim(),
      type,
      priceMode,
      bottleSizeMl: priceMode === 'bottle' ? effectiveBottleSize : null,
      bottlePrice: priceMode === 'bottle' ? parseFloat(bottlePrice) : null,
      costPerLiter: derivedCostPerLiter,
      stock: editing?.stock,
    };
    onSave(payload, editing?.id);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title={editing ? 'Modifica Ingrediente' : 'Nuovo Ingrediente'}
      icon={<FlaskConical className="w-5 h-5 text-[#E31B23]" />}
      footer={
        <button onClick={submit} className="w-full py-3.5 rounded-2xl text-[15px] font-semibold bg-[#E31B23] text-white hover:bg-[#c41820] active:scale-[0.98] transition-all flex items-center justify-center gap-2" style={{ minHeight: 50 }}>
          <Check className="w-4.5 h-4.5" />{editing ? 'Salva Modifiche' : 'Aggiungi Ingrediente'}
        </button>
      }>
      <div className="p-5 space-y-4">
        <Field label="Nome">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Gin Tanqueray" className={inputCls} />
        </Field>

        <Field label="Categoria">
          <div className="grid grid-cols-4 gap-1.5">
            {INGREDIENT_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className="px-2 py-2.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: type === t ? '#E31B23' : 'rgba(244,244,240,0.05)', color: type === t ? '#fff' : '#A8A29E', minHeight: 40 }}>
                {INGREDIENT_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Come vuoi indicare il prezzo?">
          <Segmented value={priceMode} onChange={setPriceMode}
            options={[{ value: 'bottle', label: 'A bottiglia' }, { value: 'liter', label: 'Al litro' }]} />
        </Field>

        {priceMode === 'bottle' ? (
          <>
            <Field label="Formato bottiglia (ml)">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {BOTTLE_PRESETS.map((v) => (
                  <button key={v} type="button" onClick={() => { setBottleSizeMl(v); setCustomBottle(''); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{ background: !customBottle && bottleSizeMl === v ? '#E31B23' : 'rgba(244,244,240,0.05)', color: !customBottle && bottleSizeMl === v ? '#fff' : '#A8A29E' }}>
                    {v} ml
                  </button>
                ))}
              </div>
              <input type="number" min="1" placeholder="Formato personalizzato (ml)" value={customBottle}
                onChange={(e) => setCustomBottle(e.target.value)} className={`${inputCls} tabular-nums`} />
            </Field>
            <Field label="Prezzo della bottiglia (€)">
              <input type="number" min="0" step="0.01" value={bottlePrice} onChange={(e) => setBottlePrice(e.target.value)}
                placeholder="12.90" className={`${inputCls} tabular-nums`} />
            </Field>
            <div className="px-4 py-3 rounded-2xl bg-[#34D399]/[0.08] border border-[#34D399]/20 flex items-center justify-between">
              <span className="text-xs text-[#A8A29E]">Costo al litro calcolato</span>
              <span className="text-sm font-semibold text-[#34D399] tabular-nums">€{derivedCostPerLiter.toFixed(2)}/L</span>
            </div>
          </>
        ) : (
          <Field label="Costo per Litro (€)">
            <input type="number" min="0" step="0.01" value={costPerLiter} onChange={(e) => setCostPerLiter(e.target.value)}
              placeholder="18.50" className={`${inputCls} tabular-nums`} />
          </Field>
        )}
      </div>
    </Sheet>
  );
}

/* ---------- Cocktail Editor: name + ingredients in one flow ---------- */
function CocktailEditorSheet({ open, onClose, store, editingCocktailId }) {
  const { ingredients, cocktails, addIngredient, addCocktail, updateCocktail, settings } = store;
  const editingCocktail = editingCocktailId ? cocktails.find((c) => c.id === editingCocktailId) : null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [profitMargin, setProfitMargin] = useState(settings.defaultProfitMargin);
  const [vatRate, setVatRate] = useState(settings.defaultVatRate);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [draftItems, setDraftItems] = useState([]); // {ingredientId, volumeCl}
  const [search, setSearch] = useState('');
  const [showNewIngredient, setShowNewIngredient] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingCocktail) {
      setName(editingCocktail.name);
      setDescription(editingCocktail.description || '');
      setProfitMargin(editingCocktail.profitMargin);
      setVatRate(editingCocktail.vatRate);
      setDraftItems(editingCocktail.recipeItems.map((r) => ({ ingredientId: r.ingredientId, volumeCl: r.volumeCl })));
    } else {
      setName(''); setDescription('');
      setProfitMargin(settings.defaultProfitMargin); setVatRate(settings.defaultVatRate);
      setDraftItems([]);
    }
    setSearch(''); setShowAdvanced(false); setShowNewIngredient(false);
  }, [open, editingCocktailId]);

  const filteredIngredients = ingredients.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  const addDraftItem = (ingredientId) => {
    setDraftItems((items) => {
      const existing = items.find((it) => it.ingredientId === ingredientId);
      if (existing) return items.map((it) => it.ingredientId === ingredientId ? { ...it, volumeCl: it.volumeCl + 1 } : it);
      return [...items, { ingredientId, volumeCl: 4.5 }];
    });
  };
  const stepDraft = (ingredientId, delta) => {
    setDraftItems((items) => items.map((it) => it.ingredientId === ingredientId
      ? { ...it, volumeCl: Math.max(0.5, +(it.volumeCl + delta).toFixed(1)) } : it));
  };
  const removeDraft = (ingredientId) => setDraftItems((items) => items.filter((it) => it.ingredientId !== ingredientId));

  const handleNewIngredientSave = (payload) => {
    const newId = addIngredient(payload);
    addDraftItem(newId);
  };

  const submit = () => {
    if (!name.trim()) return;
    const recipeItems = draftItems.map((it) => {
      const ing = ingredients.find((i) => i.id === it.ingredientId);
      return { ingredientId: it.ingredientId, volumeCl: it.volumeCl, calculatedCost: (it.volumeCl / 100) * (ing?.costPerLiter || 0) };
    });
    if (editingCocktail) {
      updateCocktail(editingCocktail.id, { name: name.trim(), description: description.trim(), profitMargin, vatRate, recipeItems });
    } else {
      addCocktail({ name: name.trim(), description: description.trim(), profitMargin, vatRate, recipeItems });
    }
    onClose();
  };

  const totalCost = draftItems.reduce((sum, it) => {
    const ing = ingredients.find((i) => i.id === it.ingredientId);
    return sum + (it.volumeCl / 100) * (ing?.costPerLiter || 0);
  }, 0);

  return (
    <Sheet open={open} onClose={onClose} wide
      title={editingCocktail ? 'Modifica Drink' : 'Nuovo Drink'}
      icon={editingCocktail ? <Pencil className="w-5 h-5 text-[#E31B23]" /> : <Wine className="w-5 h-5 text-[#E31B23]" />}
      footer={
        <button onClick={submit} disabled={!name.trim()}
          className="w-full py-3.5 rounded-2xl text-[15px] font-semibold bg-[#E31B23] text-white hover:bg-[#c41820] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:active:scale-100"
          style={{ minHeight: 50 }}>
          <Check className="w-4.5 h-4.5" />{editingCocktail ? 'Salva Modifiche' : `Crea Drink${totalCost > 0 ? ` · €${totalCost.toFixed(2)} costo` : ''}`}
        </button>
      }>
      <div className="p-5 space-y-4">
        <Field label="Nome del Drink">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Negroni Sbagliato" className={inputCls} autoFocus />
        </Field>
        <Field label={<>Descrizione <span className="text-[#A8A29E]/50">- opzionale</span></>}>
          <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrizione..." className={`${inputCls} resize-none`} />
        </Field>

        <button onClick={() => setShowAdvanced((v) => !v)} className="flex items-center gap-1.5 text-sm text-[#A8A29E] hover:text-[#F4F4F0] transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" />Margine e IVA {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showAdvanced && (
          <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A8A29E]">Margine di guadagno</span>
              <span className="text-sm font-semibold text-[#34D399] tabular-nums">{profitMargin}%</span>
            </div>
            <input type="range" min="0" max="500" step="5" value={profitMargin} onChange={(e) => setProfitMargin(parseInt(e.target.value))} className="w-full" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#A8A29E]">Aliquota IVA</span>
              <span className="text-sm font-semibold text-[#8B5CF6] tabular-nums">{vatRate}%</span>
            </div>
            <input type="range" min="0" max="50" step="1" value={vatRate} onChange={(e) => setVatRate(parseInt(e.target.value))} className="w-full" />
          </div>
        )}

        <div className="pt-1">
          <p className="text-sm font-medium text-[#F4F4F0] mb-2 flex items-center gap-2"><ListPlus className="w-4 h-4 text-[#E31B23]" />Ingredienti</p>

          {draftItems.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {draftItems.map((it) => {
                const ing = ingredients.find((i) => i.id === it.ingredientId);
                if (!ing) return null;
                const cost = (it.volumeCl / 100) * ing.costPerLiter;
                return (
                  <div key={it.ingredientId} className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: INGREDIENT_TYPE_COLORS[ing.type] }} />
                    <span className="text-sm text-[#F4F4F0] flex-1 min-w-0 truncate">{ing.name}</span>
                    <button onClick={() => stepDraft(it.ingredientId, -0.5)} className="w-8 h-8 rounded-full bg-white/[0.08] text-[#F4F4F0] flex items-center justify-center active:scale-90 transition-transform shrink-0">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-[#F4F4F0] tabular-nums w-12 text-center shrink-0">{it.volumeCl.toFixed(1)}cl</span>
                    <button onClick={() => stepDraft(it.ingredientId, 0.5)} className="w-8 h-8 rounded-full bg-white/[0.08] text-[#F4F4F0] flex items-center justify-center active:scale-90 transition-transform shrink-0">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-[#34D399] tabular-nums w-14 text-right shrink-0">€{cost.toFixed(2)}</span>
                    <button onClick={() => removeDraft(it.ingredientId)} className="w-8 h-8 rounded-full text-[#A8A29E] hover:text-[#E31B23] flex items-center justify-center transition-all shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="relative mb-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            <input type="text" placeholder="Cerca tra i tuoi ingredienti..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#F4F4F0] placeholder-[#A8A29E] focus:outline-none focus:border-[#E31B23] transition-all" />
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1 rounded-2xl bg-white/[0.02] p-1.5 border border-white/[0.05]">
            {filteredIngredients.map((ing) => {
              const inDraft = draftItems.some((it) => it.ingredientId === ing.id);
              return (
                <IngredientRow key={ing.id} ing={ing} onTap={() => addDraftItem(ing.id)}
                  trailing={
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: inDraft ? '#34D399' : 'rgba(227,27,35,0.15)', color: inDraft ? '#0D0D0D' : '#E31B23' }}>
                      {inDraft ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  } />
              );
            })}
            {filteredIngredients.length === 0 && (
              <p className="text-center text-xs text-[#A8A29E] py-4">Nessun ingrediente trovato</p>
            )}
          </div>

          <button onClick={() => setShowNewIngredient(true)}
            className="w-full mt-2 py-3 rounded-2xl text-sm font-medium border border-dashed border-white/15 text-[#A8A29E] hover:text-[#F4F4F0] hover:border-[#E31B23]/40 transition-all flex items-center justify-center gap-2" style={{ minHeight: 46 }}>
            <Plus className="w-4 h-4" />Registra un nuovo ingrediente
          </button>
        </div>
      </div>

      <IngredientSheet open={showNewIngredient} onClose={() => setShowNewIngredient(false)} onSave={handleNewIngredientSave} editing={null} />
    </Sheet>
  );
}

/* ---------- Root App ---------- */
export default function App() {
  const store = useCocktailStore();
  const { cocktails, selectedCocktailId, setSelectedCocktailId, addIngredient, updateIngredient } = store;

  const [activeTab, setActiveTab] = useState('builder');
  const [ingredientSheetOpen, setIngredientSheetOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [cocktailSheetOpen, setCocktailSheetOpen] = useState(false);
  const [editingCocktailId, setEditingCocktailId] = useState(null);

  useEffect(() => {
    if (!selectedCocktailId && cocktails.length > 0) setSelectedCocktailId(cocktails[0].id);
  }, [selectedCocktailId, cocktails, setSelectedCocktailId]);

  const openNewCocktail = () => { setEditingCocktailId(null); setCocktailSheetOpen(true); };
  const openEditCocktail = (id) => { setEditingCocktailId(id); setCocktailSheetOpen(true); };
  const openNewIngredient = () => { setEditingIngredient(null); setIngredientSheetOpen(true); };
  const openEditIngredient = (ing) => { setEditingIngredient(ing); setIngredientSheetOpen(true); };

  const handleIngredientSave = (payload, id) => {
    if (id) updateIngredient(id, payload);
    else addIngredient(payload);
  };

  const quickAdd = () => {
    if (activeTab === 'inventory') openNewIngredient();
    else openNewCocktail();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F0] relative overflow-hidden" style={{ fontFamily: appleFontStack }}>
      <GlobalStyle />

      <LiquidBackground />
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.003) 2px, rgba(255,255,255,0.003) 4px)',
      }} />

      <TopNavigation onNewDrink={openNewCocktail} />

      <div className="relative z-10 pt-20 lg:pt-24 pb-28 lg:pb-6 px-3 lg:px-6 min-h-screen">
        {/* Desktop: 3-column grid always visible */}
        <div className="hidden lg:grid grid-cols-12 gap-5 h-[calc(100vh-120px)]">
          <div className="col-span-3 flex flex-col gap-4 h-full">
            <div className="flex-1 min-h-0"><IngredientPanel store={store} onAddIngredient={openNewIngredient} onEditIngredient={openEditIngredient} /></div>
            <div className="shrink-0"><CocktailList store={store} onNewCocktail={openNewCocktail} /></div>
          </div>
          <div className="col-span-5 h-full"><CocktailBuilder store={store} onNewCocktail={openNewCocktail} onEditCocktail={openEditCocktail} /></div>
          <div className="col-span-4 h-full"><CostAnalysis store={store} /></div>
        </div>

        {/* Mobile: single tab at a time */}
        <div className="lg:hidden" style={{ minHeight: 'calc(100vh - 180px)' }}>
          {activeTab === 'inventory' && (
            <div className="flex flex-col gap-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
              <div style={{ height: 'calc(100vh - 340px)', minHeight: 320 }}>
                <IngredientPanel store={store} onAddIngredient={openNewIngredient} onEditIngredient={openEditIngredient} />
              </div>
              <CocktailList store={store} onNewCocktail={openNewCocktail} />
            </div>
          )}
          {activeTab === 'builder' && (
            <div style={{ minHeight: 'calc(100vh - 180px)' }}>
              <CocktailBuilder store={store} onNewCocktail={openNewCocktail} onEditCocktail={openEditCocktail} />
            </div>
          )}
          {activeTab === 'analysis' && (
            <div style={{ minHeight: 'calc(100vh - 180px)' }}>
              <CostAnalysis store={store} />
            </div>
          )}
        </div>
      </div>

      <BottomTabBar active={activeTab} onChange={setActiveTab} onQuickAdd={quickAdd} />

      <IngredientSheet open={ingredientSheetOpen} onClose={() => setIngredientSheetOpen(false)} onSave={handleIngredientSave} editing={editingIngredient} />
      <CocktailEditorSheet open={cocktailSheetOpen} onClose={() => setCocktailSheetOpen(false)} store={store} editingCocktailId={editingCocktailId} />
    </div>
  );
}

const appleFontStack = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif";

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital@0;1&display=swap');
      .font-editorial { font-family: 'Playfair Display', serif; }
      .tabular-nums { font-variant-numeric: tabular-nums; }
      .glass-surface { background: rgba(244,244,240,0.03); border: 1px solid rgba(244,244,240,0.10); backdrop-filter: blur(12px); }
      .glass-surface-solid { background: #141414; border: 1px solid rgba(244,244,240,0.10); }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #0D0D0D; }
      ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #E31B23; }
      input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      input[type="number"] { -moz-appearance: textfield; }
      input[type="range"] { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 3px; background: #262626; outline: none; }
      input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #E31B23; cursor: pointer; box-shadow: 0 2px 8px rgba(227,27,35,0.5); border: 2.5px solid #F4F4F0; }
      input[type="range"]::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #E31B23; cursor: pointer; border: 2.5px solid #F4F4F0; box-shadow: 0 2px 8px rgba(227,27,35,0.5); }
      button { -webkit-tap-highlight-color: transparent; }
    `}</style>
  );
}
