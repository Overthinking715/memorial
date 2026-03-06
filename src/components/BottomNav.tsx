import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <div className="relative w-full border-t border-paper-stroke/30 bg-background-light/95 backdrop-blur-md px-4 pb-6 pt-2 shadow-sm z-40">
      <div className="flex gap-2 max-w-md mx-auto">
        <NavLink to="/" className={({isActive}) => `flex flex-1 flex-col items-center justify-end gap-1 rounded-full transition-colors ${isActive ? 'text-primary' : 'text-ash hover:text-primary'}`}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>table_restaurant</span>
          </div>
          <p className="text-[10px] font-display tracking-widest">祭台</p>
        </NavLink>
        <NavLink to="/hub" className={({isActive}) => `flex flex-1 flex-col items-center justify-end gap-1 rounded-full transition-colors ${isActive ? 'text-primary' : 'text-ash hover:text-primary'}`}>
          <div className="flex h-8 items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
          </div>
          <p className="text-[10px] font-display tracking-widest font-bold">印记馆</p>
        </NavLink>
      </div>
    </div>
  );
}
