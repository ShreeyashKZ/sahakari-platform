import React, { useState } from 'react';
import { Vote, CheckCircle2, XCircle, MinusCircle, Users, Award, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CooperativeAssemblyTab({ isRwaView = false }) {
  const { proposals, castVote, activeWorker, currentUser } = useApp();
  const [activeFilter, setActiveFilter] = useState('active'); // 'active' | 'passed'

  const isShareholder = activeWorker?.isShareholder || currentUser?.isShareholder || isRwaView;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-indigo-400/30">
              <Vote className="w-3.5 h-3.5" />
              <span>Direct Democratic Governance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Cooperative Assembly & Ballots</h2>
            <p className="text-indigo-200 text-sm max-w-xl mt-1">
              One Member, One Vote. Every pricing floor, equipment procurement, and platform fee policy is decided directly by guild technicians and resident partners.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center space-x-3 self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-indigo-200">Active Electorate</div>
              <div className="font-bold text-white text-lg">1,420 Voting Members</div>
            </div>
          </div>
        </div>

        {/* Voting Membership Status Banner */}
        {!isShareholder && !isRwaView && (
          <div className="mt-4 p-3.5 bg-amber-500/20 border border-amber-400/40 rounded-xl flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>You are currently an <strong>Associate Member</strong>. Purchase a ₹100 cooperative share in your Capital tab to cast binding votes.</span>
            </div>
          </div>
        )}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-slate-800 text-base sm:text-lg flex items-center space-x-2">
            <span>Active Ballots ({proposals?.length || 0})</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </h3>
          <span className="text-xs text-slate-500">Quorum: 60% Required</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {proposals?.map((proposal) => {
            const totalVotes = proposal.votesYes + proposal.votesNo + proposal.votesAbstain;
            const yesPct = totalVotes > 0 ? Math.round((proposal.votesYes / totalVotes) * 100) : 0;
            const noPct = totalVotes > 0 ? Math.round((proposal.votesNo / totalVotes) * 100) : 0;
            const userVote = proposal.userVoted; // 'yes' | 'no' | 'abstain' | null

            return (
              <div
                key={proposal.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Proposal Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                      {proposal.id}
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <span className="text-xs font-medium text-slate-500">{proposal.category}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Closes in <span className="font-semibold text-slate-700">{proposal.daysLeft} days</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {proposal.title}
                </h4>
                <p className="text-slate-600 text-sm mt-1.5 leading-relaxed">
                  {proposal.description}
                </p>

                {/* Impact Statement */}
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-2.5 text-xs text-slate-700">
                  <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Cooperative Rationale: </span>
                    {proposal.rationale}
                  </div>
                </div>

                {/* Voting Bar Progress */}
                <div className="mt-5 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Favor: {yesPct}% ({proposal.votesYes} votes)
                    </span>
                    <span className="text-rose-700 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Against: {noPct}% ({proposal.votesNo} votes)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${yesPct}%` }}
                      className="bg-emerald-500 transition-all duration-500"
                    />
                    <div
                      style={{ width: `${noPct}%` }}
                      className="bg-rose-400 transition-all duration-500"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Total Ballots Cast: {totalVotes}</span>
                    <span>Abstained: {proposal.votesAbstain}</span>
                  </div>
                </div>

                {/* Vote Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {userVote ? (
                      <span className="font-semibold text-indigo-700">
                        ✓ Your current vote: {userVote.toUpperCase()}
                      </span>
                    ) : (
                      <span>Cast your democratic ballot:</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => castVote(proposal.id, 'yes')}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors h-10 ${
                        userVote === 'yes'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Vote Yes</span>
                    </button>

                    <button
                      onClick={() => castVote(proposal.id, 'no')}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors h-10 ${
                        userVote === 'no'
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Vote No</span>
                    </button>

                    <button
                      onClick={() => castVote(proposal.id, 'abstain')}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors h-10 ${
                        userVote === 'abstain'
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <MinusCircle className="w-3.5 h-3.5" />
                      <span>Abstain</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
