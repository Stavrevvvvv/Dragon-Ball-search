export default function CharacterCard({ c }) {
    return (
      <div className="card">
        <img
          src={c.image}
          alt={c.name}
          loading="lazy"
          onError={(e) => {
            // Prevent infinite loop if placeholder also fails
            if (e.currentTarget.dataset.fallback === 'done') return;
            e.currentTarget.dataset.fallback = 'done';
            console.warn('Image failed to load, using placeholder:', c.image);
            e.currentTarget.src = `https://placehold.co/600x400?text=${encodeURIComponent(c.name)}`;
          }}
        />
        <div className="content">
          <h3>{c.name}</h3>
          <p className="ki"><strong>Base ki:</strong> {c.ki ?? '—'}</p>
          <p className="desc">{c.description || 'No description provided.'}</p>
        </div>
      </div>
    );
  }