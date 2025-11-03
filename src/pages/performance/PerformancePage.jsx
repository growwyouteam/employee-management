import { useQuery } from '@tanstack/react-query';
import { performanceAPI } from '../../api/performance';
import useAuthStore from '../../store/authStore';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { Target, Star, TrendingUp } from 'lucide-react';

const PerformancePage = () => {
  const { user } = useAuthStore();

  const { data: goalsData, isLoading: loadingGoals } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => performanceAPI.getGoals({ employeeId: user?.id }),
  });

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ['reviews', user?.id],
    queryFn: () => performanceAPI.getReviews({ employeeId: user?.id }),
  });

  const { data: feedbackData } = useQuery({
    queryKey: ['feedback', user?.id],
    queryFn: () => performanceAPI.getFeedback({ employeeId: user?.id }),
  });

  if (loadingGoals || loadingReviews) return <Loading />;

  const goals = goalsData?.data || [];
  const reviews = reviewsData?.data || [];
  const feedback = feedbackData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
        <p className="text-gray-600 mt-1">Track your goals and performance reviews</p>
      </div>

      {/* Goals */}
      <Card title="My Goals">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
                <Badge status={goal.status}>{goal.status}</Badge>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* KPIs */}
              {goal.kpis && goal.kpis.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {goal.kpis.map((kpi, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-500">{kpi.metric}</p>
                      <p className="text-sm font-medium">
                        {kpi.current} / {kpi.target}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Reviews */}
      <Card title="Performance Reviews">
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.reviewType} Review</h3>
                  <p className="text-sm text-gray-600">{review.period}</p>
                  <p className="text-xs text-gray-500 mt-1">By: {review.reviewerName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-lg">{review.ratings.overall}</span>
                </div>
              </div>

              {/* Ratings */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                {Object.entries(review.ratings).filter(([key]) => key !== 'overall').map(([key, value]) => (
                  <div key={key} className="p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500 capitalize">{key}</p>
                    <p className="text-sm font-medium">{value}/5</p>
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-sm text-gray-700">{review.comments}</p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-xs font-medium text-green-700 mb-2">Strengths</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {review.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-orange-700 mb-2">Areas for Improvement</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {review.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feedback */}
      {feedback.length > 0 && (
        <Card title="Recent Feedback">
          <div className="space-y-3">
            {feedback.map((fb) => (
              <div key={fb.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{fb.fromName}</p>
                    <p className="text-xs text-gray-500">{fb.type} • {fb.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{fb.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{fb.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PerformancePage;
