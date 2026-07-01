export default function HealthView({ onTabChange }) {
  const metrics = [
    { label: 'Nail scan quality',  value: 'Good',         valueColor: '#8c3f4f' },
    { label: 'Iron intake trend',  value: 'Below target', valueColor: '#8c3f4f' },
    { label: 'Symptoms',           value: 'Mild fatigue', valueColor: '#8c3f4f' },
  ];

  return (
    <div
      id="health"
      className="screen-scroll h-full overflow-y-auto px-[18px] pt-[16px] pb-[92px]"
    >
      {/* Header */}
      <header className="flex justify-between items-center gap-[16px] mb-[14px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Preventive health
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Early anemia risk</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[44px] min-h-[44px] px-[14px] rounded-[22px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0"
        >
          Home
        </button>
      </header>

      {/* Anemia Card */}
      <section className="rounded-[8px] p-[18px] flex items-start gap-[16px] bg-[#f4e8e9]">
        {/* Nail scan visual */}
        <div className="nail-scan" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            Phone camera check
          </p>
          <h2 className="text-[18px] leading-[1.16] font-[800] mb-[6px]">Low risk today</h2>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38]">
            Based on nail color scan, fatigue note, and recent meals. Confirm with a blood test if symptoms continue.
          </p>
        </div>
      </section>

      {/* Metric list */}
      <section className="grid gap-[8px] my-[14px]">
        {metrics.map(({ label, value }) => (
          <article
            key={label}
            className="bg-white border border-[#e2e8e4] rounded-[8px] flex justify-between gap-[14px] p-[14px] text-[13px]"
          >
            <span>{label}</span>
            <strong className="text-[#8c3f4f] text-right">{value}</strong>
          </article>
        ))}
      </section>

      {/* Next Best Action */}
      <section className="mt-[16px]">
        <div className="flex justify-between items-baseline mb-[10px]">
          <h2 className="text-[18px] leading-[1.16] font-[800]">Next best action</h2>
          <span className="text-[#7a8a84] text-[12px] font-[800]">AI reminder</span>
        </div>
        <article className="bg-white border border-[#e2e8e4] rounded-[8px] p-[14px]">
          <h3 className="text-[15px] leading-[1.2] font-[700]">Add iron-rich dinner</h3>
          <p className="text-[#5f6f69] text-[13px] leading-[1.38] mt-[4px]">
            Tofu, spinach, chicken, beans, and citrus are added to tonight's plan.
          </p>
          <button
            onClick={() => onTabChange('plan')}
            className="min-h-[40px] border-0 rounded-[8px] bg-[#1f6e64] text-white font-[900] mt-[12px] px-[14px] hover:bg-[#196059] transition-colors"
          >
            Update dinner
          </button>
        </article>
      </section>
    </div>
  );
}
