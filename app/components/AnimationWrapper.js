// Removed all animations - completely static app
export default function AnimationWrapper({ children }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
