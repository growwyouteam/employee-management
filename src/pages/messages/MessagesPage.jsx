import { useQuery } from '@tanstack/react-query';
import { messagesAPI, announcementsAPI } from '../../api/announcements';
import useAuthStore from '../../store/authStore';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { MessageSquare, Bell, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const MessagesPage = () => {
  const { user } = useAuthStore();

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', user?.id],
    queryFn: () => messagesAPI.getAll({ userId: user?.id }),
  });

  const { data: announcementsData, isLoading: loadingAnnouncements } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsAPI.getAll(),
  });

  if (loadingMessages || loadingAnnouncements) return <Loading />;

  const messages = messagesData?.data || [];
  const announcements = announcementsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages & Announcements</h1>
        <p className="text-gray-600 mt-1">Stay updated with company communications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2">
          <Card title="Messages">
            <div className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      message.read
                        ? 'bg-white border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <p className="font-medium text-gray-900">{message.fromName}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-gray-900 mb-1">
                      {message.subject}
                    </p>
                    <p className="text-sm text-gray-600">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Announcements */}
        <div>
          <Card title="Announcements">
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Bell className="w-4 h-4 text-primary-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm text-gray-900">
                          {announcement.title}
                        </p>
                        <Badge variant={announcement.priority === 'High' ? 'red' : 'blue'}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(announcement.postedOn)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
