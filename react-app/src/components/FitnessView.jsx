import { useState } from 'react';

export default function FitnessView({ onTabChange }) {
  const [showForm, setShowForm] = useState(true);

  return (
    <div
      id="fitness"
      className="screen-scroll h-full overflow-y-auto px-[24px] pt-[24px] pb-[100px]"
    >
      <header className="flex justify-between items-center gap-[16px] mb-[24px]">
        <div>
          <p className="m-0 mb-[5px] uppercase text-[11px] leading-[1.15] text-[#61716c] font-[850] tracking-[0]">
            AI Personal Trainer
          </p>
          <h1 className="text-[24px] leading-[1.05] font-[800]">Fitness Planner</h1>
        </div>
        <button
          onClick={() => onTabChange('home')}
          className="min-w-[48px] min-h-[48px] px-[16px] rounded-[24px] bg-[#eaf0ec] text-[#25453e] text-[13px] font-[800] border-0 transition-all duration-300 ease-in-out active:scale-95"
        >
          Home
        </button>
      </header>

      {showForm ? (
        <section className="mt-6 rounded-3xl p-6 bg-white shadow-lg shadow-black/5 border-0 transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-baseline mb-5">
            <h2 className="text-[18px] leading-[1.16] font-[800]">Your Profile</h2>
            <span className="text-[#7a8a84] text-[12px] font-[800]">Required</span>
          </div>

          <form 
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setShowForm(false);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-[850] text-[#253532] ml-1">Age</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 28" 
                  className="min-h-[48px] rounded-2xl bg-[#f8faf7] text-[#17231f] px-4 outline-none border border-transparent shadow-inner focus:border-[#2c7a70]/30 focus:shadow-md focus:bg-white transition-all duration-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-[850] text-[#253532] ml-1">Gender</label>
                <select className="min-h-[48px] rounded-2xl bg-[#f8faf7] text-[#17231f] px-4 outline-none border border-transparent shadow-inner focus:border-[#2c7a70]/30 focus:shadow-md focus:bg-white transition-all duration-300">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-[850] text-[#253532] ml-1">Height (cm)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 175" 
                  className="min-h-[48px] rounded-2xl bg-[#f8faf7] text-[#17231f] px-4 outline-none border border-transparent shadow-inner focus:border-[#2c7a70]/30 focus:shadow-md focus:bg-white transition-all duration-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-[850] text-[#253532] ml-1">Weight (kg)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 70" 
                  className="min-h-[48px] rounded-2xl bg-[#f8faf7] text-[#17231f] px-4 outline-none border border-transparent shadow-inner focus:border-[#2c7a70]/30 focus:shadow-md focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-[850] text-[#253532] ml-1">Fitness Goals</label>
              <select className="min-h-[48px] rounded-2xl bg-[#f8faf7] text-[#17231f] px-4 outline-none border border-transparent shadow-inner focus:border-[#2c7a70]/30 focus:shadow-md focus:bg-white transition-all duration-300">
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Endurance</option>
                <option>General Fitness</option>
              </select>
            </div>

            <div className="flex items-center justify-between bg-[#f8faf7] rounded-2xl px-4 min-h-[48px] shadow-inner border border-transparent transition-all duration-300 mt-2">
              <label className="text-[12px] font-[850] text-[#253532]">Access to Equipment?</label>
              <select className="border-0 bg-transparent text-[#2c7a70] font-[800] text-[13px] outline-none cursor-pointer">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <button type="submit" className="w-full min-h-[56px] border-0 rounded-2xl bg-[#1f6e64] text-white font-[900] mt-4 shadow-lg shadow-[#1f6e64]/30 hover:bg-[#196059] transition-all duration-300 ease-in-out active:scale-95">
              Generate AI Workout
            </button>
          </form>
        </section>
      ) : (
        <section className="mt-6">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-[18px] leading-[1.16] font-[800]">Generated Routine</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="text-[#e39b45] text-[12px] font-[800] bg-transparent border-0 underline transition-all duration-300 ease-in-out hover:opacity-80 active:scale-95 cursor-pointer p-0"
            >
              Reconfigure
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <article
              className="grid items-center bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border-l-[6px] border-[#246e63] transition-all duration-300 ease-in-out hover:scale-[1.02]"
              style={{ gridTemplateColumns: '54px 1fr', gap: '10px' }}
            >
              <div className="text-[#246e63] text-[12px] font-[900]">Warmup</div>
              <div>
                <h3 className="text-[15px] leading-[1.2] font-[700]">Dynamic Stretching</h3>
                <p className="text-[#5f6f69] text-[13px] leading-[1.38]">5 mins · Arm circles, leg swings</p>
              </div>
            </article>

            <article
              className="grid items-center bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border-l-[6px] border-[#e39b45] transition-all duration-300 ease-in-out hover:scale-[1.02]"
              style={{ gridTemplateColumns: '54px 1fr', gap: '10px' }}
            >
              <div className="text-[#e39b45] text-[12px] font-[900]">Block 1</div>
              <div>
                <h3 className="text-[15px] leading-[1.2] font-[700]">Bodyweight Squats</h3>
                <p className="text-[#5f6f69] text-[13px] leading-[1.38]">3 sets of 15 reps</p>
              </div>
            </article>

            <article
              className="grid items-center bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border-l-[6px] border-[#e39b45] transition-all duration-300 ease-in-out hover:scale-[1.02]"
              style={{ gridTemplateColumns: '54px 1fr', gap: '10px' }}
            >
              <div className="text-[#e39b45] text-[12px] font-[900]">Block 2</div>
              <div>
                <h3 className="text-[15px] leading-[1.2] font-[700]">Pushups</h3>
                <p className="text-[#5f6f69] text-[13px] leading-[1.38]">3 sets of 10 reps</p>
              </div>
            </article>

            <article
              className="grid items-center bg-white rounded-2xl p-4 shadow-lg shadow-black/5 border-l-[6px] border-[#586bb5] transition-all duration-300 ease-in-out hover:scale-[1.02]"
              style={{ gridTemplateColumns: '54px 1fr', gap: '10px' }}
            >
              <div className="text-[#586bb5] text-[12px] font-[900]">Cooldown</div>
              <div>
                <h3 className="text-[15px] leading-[1.2] font-[700]">Static Stretching</h3>
                <p className="text-[#5f6f69] text-[13px] leading-[1.38]">5 mins · Hamstring stretch, chest stretch</p>
              </div>
            </article>
          </div>
        </section>
      )}
    </div>
  );
}
