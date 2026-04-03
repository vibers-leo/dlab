import { View, Text, ScrollView, Pressable } from "react-native";
import {
  Users,
  Globe,
  CreditCard,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react-native";

const STATS = [
  { label: "활성 고객", value: "12", icon: Users, color: "#475569" },
  { label: "관리 사이트", value: "18", icon: Globe, color: "#3b82f6" },
  { label: "월 매출", value: "540만", icon: CreditCard, color: "#10b981" },
  { label: "신규 문의", value: "3", icon: TrendingUp, color: "#f59e0b" },
];

const MOCK_CLIENTS = [
  {
    id: "1",
    name: "드림카페",
    status: "active",
    sites: 2,
    monthlyFee: "50만원",
    nextPayment: "2026.04.01",
  },
  {
    id: "2",
    name: "서울법률사무소",
    status: "active",
    sites: 1,
    monthlyFee: "80만원",
    nextPayment: "2026.04.05",
  },
  {
    id: "3",
    name: "블루핏 요가",
    status: "pending",
    sites: 1,
    monthlyFee: "30만원",
    nextPayment: "미정",
  },
  {
    id: "4",
    name: "패션몰",
    status: "active",
    sites: 3,
    monthlyFee: "120만원",
    nextPayment: "2026.04.10",
  },
];

export default function DashboardScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pb-8"
    >
      {/* 통계 */}
      <View className="flex-row flex-wrap mx-4 mt-4 gap-3">
        {STATS.map((stat) => (
          <View
            key={stat.label}
            className="bg-surface rounded-xl p-4 flex-1 min-w-[45%]"
          >
            <stat.icon size={20} color={stat.color} />
            <Text className="text-text font-bold text-xl mt-2">
              {stat.value}
            </Text>
            <Text className="text-text-muted text-xs mt-1">{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* 고객 목록 */}
      <View className="mx-4 mt-6">
        <Text className="text-lg font-bold text-text mb-4">고객 현황</Text>
        {MOCK_CLIENTS.map((client) => (
          <Pressable
            key={client.id}
            className="bg-surface rounded-xl p-4 mb-3"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-text font-bold">{client.name}</Text>
              {client.status === "active" ? (
                <View className="flex-row items-center bg-green-100 px-2 py-1 rounded-full">
                  <CheckCircle size={12} color="#10b981" />
                  <Text className="text-green-700 text-xs font-medium ml-1">
                    활성
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center bg-amber-100 px-2 py-1 rounded-full">
                  <Clock size={12} color="#f59e0b" />
                  <Text className="text-amber-700 text-xs font-medium ml-1">
                    대기
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center">
                <Globe size={14} color="#64748b" />
                <Text className="text-text-muted text-sm ml-1">
                  사이트 {client.sites}개
                </Text>
              </View>
              <View className="flex-row items-center">
                <CreditCard size={14} color="#64748b" />
                <Text className="text-text-muted text-sm ml-1">
                  {client.monthlyFee}/월
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-2">
              <Calendar size={14} color="#64748b" />
              <Text className="text-text-muted text-sm ml-1">
                다음 결제: {client.nextPayment}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View className="mx-4 mt-2">
        <Text className="text-text-muted text-xs text-center">
          결제는 추후 토스페이먼츠 연동 후 활성화됩니다
        </Text>
      </View>
    </ScrollView>
  );
}
