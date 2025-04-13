// app/dashboard/page.js

import TelegramToggle from "@/component/common/telegramToggle";



/**
 * User dashboard page showing progress and settings.
 * @returns {JSX.Element} - The dashboard page.
 */
export default async function DashboardPage() {
  // Placeholder: Fetch user data (quizzes, badges, etc.) from Spring Boot
  const userData = {
    quizzesCompleted: 5,
    badges: ['Challenger'],
    projects: ['AI App'],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>
      <section className="mb-4">
        <h2 className="text-xl">Progress</h2>
        <p>Quizzes Completed: {userData.quizzesCompleted}</p>
        <p>Badges: {userData.badges.join(', ')}</p>
        <p>Active Projects: {userData.projects.join(', ')}</p>
      </section>
      <section>
        <h2 className="text-xl">Settings</h2>
        <TelegramToggle />
      </section>
    </div>
  );
}