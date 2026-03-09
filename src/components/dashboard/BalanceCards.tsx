interface Balance {
  hours_earned: number;
  hours_used: number;
  hours_donated: number;
  available: number;
}

const cards = [
  { key: "hours_earned", label: "Hours Earned", color: "bg-teal/15 text-teal-deep" },
  { key: "hours_used", label: "Hours Used", color: "bg-rose/30 text-rose-dark" },
  { key: "hours_donated", label: "Hours Donated", color: "bg-mint/30 text-teal-deep" },
  { key: "available", label: "Available Balance", color: "bg-teal/25 text-teal-deep" },
] as const;

export default function BalanceCards({ balance }: { balance: Balance | null }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rounded-2xl p-5 ${card.color}`}
        >
          <p className="text-sm font-medium opacity-70 mb-1">{card.label}</p>
          <p className="text-3xl font-bold">
            {balance ? balance[card.key] : 0}
          </p>
        </div>
      ))}
    </div>
  );
}
