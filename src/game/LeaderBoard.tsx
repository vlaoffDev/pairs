import { Score } from './index'

const LeaderBoard = ({ leaderBoard }: { leaderBoard: Score[] }) => {
  return (
    <div className="LeaderBoard text-center py-10">
      <h1 className="text-2xl">Leaderboard</h1>
      {leaderBoard &&
        leaderBoard.map((score, index) => (
          <div key={score.id}>
            #{index + 1}: {score.name} in {score.time} and {score.clicks} clicks
          </div>
        ))}
    </div>
  )
}

export default LeaderBoard
