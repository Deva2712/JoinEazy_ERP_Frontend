// src/components/common/QuickNavigation.jsx

/**
 * DesktopQuickNav: Renders the vertical timeline-style navigation for large screens.
 * Includes the active state indicator and smooth scroll triggers.
 */
export const DesktopQuickNav = ({ navItems, activeId, onNavClick }) => (
	<div className="space-y-3">
		<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
			Contents
		</h4>

		<nav className="relative flex flex-col px-2">
			{navItems.map((item) => {
				const isActive = activeId === item.id;

				return (
					<button
						key={item.id}
						onClick={() => onNavClick(item.id)}
						className="group relative flex items-center gap-5 py-3 pl-2 transition-all outline-none"
					>
						<div
							className={`relative z-10 size-2 rounded-full border-2 transition-all duration-500 ${
								isActive
									? "bg-violet-500 border-violet-200 dark:border-violet-900 scale-150 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
									: "bg-gray-200 dark:bg-gray-800 border-transparent group-hover:border-violet-400 group-hover:bg-white dark:group-hover:bg-gray-900"
							}`}
						/>

						<div className="flex items-center gap-3">
							<item.icon
								className={`size-3.5 transition-all duration-300 ${
									isActive
										? "text-violet-600 dark:text-violet-400 scale-110"
										: "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
								}`}
							/>
							<span
								className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
									isActive
										? "text-gray-900 dark:text-white"
										: "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
								}`}
							>
								{item.label}
							</span>
						</div>

						<div
							className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-violet-500 transition-all duration-300 rounded-full ${
								isActive ? "h-6" : "h-0 group-hover:h-3"
							}`}
						/>
					</button>
				);
			})}
		</nav>
	</div>
);

/**
 * MobileStickyNav: Renders the horizontal scrolling navigation bar for mobile devices.
 * Positioned fixed at the bottom above the main tab bar.
 */
export const MobileStickyNav = ({ navItems, onNavClick }) => (
	<div className="fixed bottom-[72px] left-0 right-0 z-30 px-4 py-3 bg-gray-50/80 dark:bg-[#0f1117]/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 lg:hidden">
		<div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
			{navItems.map((item) => (
				<button
					key={item.id}
					onClick={() => onNavClick(item.id)}
					className="flex-none flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm active:scale-95 transition-all"
				>
					<item.icon className="size-3 text-violet-500" />
					{item.label}
				</button>
			))}
		</div>
	</div>
);
