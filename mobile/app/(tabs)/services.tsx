import { View, Text, ScrollView, Pressable } from "react-native";
import {
  Globe,
  Smartphone,
  Palette,
  Server,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react-native";

const SERVICES = [
  {
    icon: Globe,
    title: "웹사이트 제작",
    description: "반응형 웹사이트, 랜딩페이지, 기업 홈페이지",
    price: "200만원~",
    color: "#3b82f6",
  },
  {
    icon: Smartphone,
    title: "모바일 앱 개발",
    description: "iOS/Android 네이티브 앱, 하이브리드 앱",
    price: "500만원~",
    color: "#10b981",
  },
  {
    icon: Palette,
    title: "UI/UX 디자인",
    description: "사용자 경험 중심의 인터페이스 설계",
    price: "100만원~",
    color: "#8b5cf6",
  },
  {
    icon: Server,
    title: "서버/인프라 구축",
    description: "클라우드 서버 구축, DevOps, CI/CD",
    price: "150만원~",
    color: "#f59e0b",
  },
  {
    icon: ShieldCheck,
    title: "유지보수/관리",
    description: "월정액 유지관리, 보안 패치, 모니터링",
    price: "월 30만원~",
    color: "#ef4444",
  },
  {
    icon: Zap,
    title: "AI 솔루션",
    description: "AI 챗봇, 자동화, 데이터 분석 솔루션",
    price: "상담 후 결정",
    color: "#475569",
  },
];

export default function ServicesScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pb-8"
    >
      {/* 서비스 소개 헤더 */}
      <View className="mx-4 mt-4 bg-surface rounded-2xl p-6">
        <Text className="text-text font-bold text-lg">
          디어스가 제공하는 서비스
        </Text>
        <Text className="text-text-muted text-sm mt-2">
          비즈니스 성장을 위한 디지털 솔루션을 제공합니다.{"\n"}
          무료 상담을 통해 맞춤 견적을 받아보세요.
        </Text>
      </View>

      {/* 서비스 목록 */}
      <View className="mx-4 mt-6">
        {SERVICES.map((service) => (
          <Pressable
            key={service.title}
            className="bg-surface rounded-xl p-4 mb-3 flex-row"
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: service.color + "15" }}
            >
              <service.icon size={24} color={service.color} />
            </View>
            <View className="flex-1">
              <Text className="text-text font-bold">{service.title}</Text>
              <Text className="text-text-muted text-sm mt-1">
                {service.description}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-primary font-bold text-sm">
                  {service.price}
                </Text>
                <ArrowRight size={16} color="#94a3b8" />
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      {/* CTA */}
      <Pressable className="mx-4 mt-4 bg-primary rounded-xl py-4 items-center">
        <Text className="text-white font-bold text-base">
          무료 상담 신청하기
        </Text>
      </Pressable>
    </ScrollView>
  );
}
