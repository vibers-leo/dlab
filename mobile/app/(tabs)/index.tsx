import { View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  Star,
  Code2,
  Smartphone,
  Globe,
  ChevronRight,
  Layout,
  Rocket,
  Zap,
  Layers
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp, FadeInRight } from "react-native-reanimated";
import { fetchPortfolio, PortfolioItem } from "@/lib/api";

const CATEGORIES = ["전체", "웹사이트", "모바일 앱", "이커머스", "브랜딩"];

function getCategoryIcon(category: string) {
  switch (category) {
    case "모바일 앱":
      return Smartphone;
    case "이커머스":
      return Code2;
    default:
      return Globe;
  }
}

export default function PortfolioScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [refreshing, setRefreshing] = useState(false);

  const { data: portfolio = [] as PortfolioItem[], refetch, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ["portfolio", activeCategory],
    queryFn: () => fetchPortfolio(activeCategory === "전체" ? undefined : activeCategory),
    initialData: [],
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const displayList = portfolio.length > 0 ? portfolio : [
    { id: "1", title: "카페 브랜딩 웹사이트", client: "드림카페", category: "웹사이트", tech: ["Next.js", "Tailwind"], year: "2026" },
    { id: "2", title: "법률사무소 반응형 웹", client: "서울법률사무소", category: "웹사이트", tech: ["Rails", "Bootstrap"], year: "2025" },
    { id: "3", title: "요가 스튜디오 앱", client: "블루핏 요가", category: "모바일 앱", tech: ["React Native", "Expo"], year: "2026" }
  ];

  return (
    <ScrollView 
      className="flex-1 bg-[#0a0a0c]"
      contentContainerClassName="pb-12"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
      }
    >
      {/* 프리미엄 히어로 섹션 */}
      <View className="pt-20 pb-12 px-6">
        <Animated.View entering={FadeInDown.duration(1000)}>
          <View className="flex-row items-center gap-2 mb-4">
             <View className="w-8 h-[2px] bg-indigo-500" />
             <Text className="text-indigo-400 text-xs font-black uppercase tracking-[4px]">Agency DUS</Text>
          </View>
          <Text className="text-white text-5xl font-black leading-[52px]">
            Digital{"\n"}
            <Text className="text-indigo-500">Excellence</Text>
          </Text>
          <Text className="text-slate-400 text-base mt-6 leading-6 max-w-[80%]">
            비즈니스의 가치를 높이는{"\n"}최고급 디지털 경험을 설계합니다.
          </Text>
        </Animated.View>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerClassName="px-6 gap-3"
      >
        {CATEGORIES.map((cat, i) => (
          <Pressable
            key={cat}
            onPress={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-2xl border ${
              activeCategory === cat ? "bg-white border-white" : "border-slate-800"
            }`}
          >
            <Text
              className={`text-sm font-black ${
                activeCategory === cat ? "text-black" : "text-slate-500"
              }`}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 포트폴리오 그리드/리스트 */}
      <View className="px-6 mt-10">
        <View className="flex-row items-center justify-between mb-8">
           <Text className="text-white text-xl font-black">Featured Work</Text>
           <Layers size={20} color="#6366f1" />
        </View>

        {isLoading ? (
           <View className="py-20 items-center">
              <ActivityIndicator color="#6366f1" />
           </View>
        ) : (
          displayList.map((item, idx) => {
            const Icon = getCategoryIcon(item.category);
            return (
              <Animated.View 
                key={item.id}
                entering={FadeInUp.delay(idx * 150)}
                className="mb-8"
              >
                <Pressable className="bg-slate-900/40 rounded-[40px] overflow-hidden border border-slate-800/50">
                  {/* 이미지 영역 */}
                  <LinearGradient
                    colors={["#1e1b4b", "#0f172a"]}
                    className="h-56 items-center justify-center relative"
                  >
                    <View className="absolute top-6 left-6 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                       <Text className="text-white text-[10px] font-black uppercase tracking-widest">{item.category}</Text>
                    </View>
                    <Icon size={48} color="#6366f1" opacity={0.6} />
                  </LinearGradient>

                  <View className="p-8">
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-white text-2xl font-black">{item.title}</Text>
                      <View className="w-10 h-10 bg-indigo-500 rounded-full items-center justify-center">
                        <ChevronRight size={20} color="#fff" />
                      </View>
                    </View>
                    
                    <Text className="text-slate-400 text-sm font-medium mb-6">
                      {item.client} · <Text className="text-indigo-400">{item.year}</Text>
                    </Text>

                    <View className="flex-row flex-wrap gap-2">
                      {item.tech.map((t) => (
                        <View key={t} className="bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50">
                          <Text className="text-slate-300 text-[10px] font-bold">{t}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        )}
      </View>

      {/* CTA 섹션 */}
      <View className="px-6 mt-12 mb-8">
        <LinearGradient
          colors={["#4f46e5", "#312e81"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[40px] p-10 items-center overflow-hidden"
        >
          <View className="absolute top-0 right-0 p-8 opacity-10">
             <Rocket size={120} color="#fff" />
          </View>
          <Zap size={32} color="#fcd34d" />
          <Text className="text-white text-2xl font-black mt-4 text-center">
            당신의 아이디어를{"\n"}현실로 만드세요
          </Text>
          <Pressable className="bg-white px-10 py-4 rounded-2xl mt-8 shadow-xl shadow-indigo-900/20">
            <Text className="text-indigo-600 font-black text-base">프로젝트 문의하기</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}
