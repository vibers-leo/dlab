import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
} from "lucide-react-native";

export default function ContactScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pb-8"
    >
      {/* 연락처 정보 */}
      <View className="mx-4 mt-4 bg-surface rounded-2xl p-6">
        <Text className="text-text font-bold text-lg mb-4">연락처</Text>

        <View className="flex-row items-center mb-3">
          <Phone size={18} color="#475569" />
          <Text className="text-text ml-3">010-0000-0000</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Mail size={18} color="#475569" />
          <Text className="text-text ml-3">contact@dus.co.kr</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <MapPin size={18} color="#475569" />
          <Text className="text-text ml-3">서울특별시</Text>
        </View>
        <View className="flex-row items-center">
          <Clock size={18} color="#475569" />
          <Text className="text-text ml-3">
            평일 09:00 ~ 18:00 (주말/공휴일 휴무)
          </Text>
        </View>
      </View>

      {/* 문의 폼 */}
      <View className="mx-4 mt-6">
        <Text className="text-lg font-bold text-text mb-4">문의하기</Text>

        <View className="mb-4">
          <Text className="text-text font-medium mb-2">이름</Text>
          <TextInput
            className="bg-surface rounded-xl px-4 py-3 text-text"
            placeholder="이름을 입력해주세요"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View className="mb-4">
          <Text className="text-text font-medium mb-2">이메일</Text>
          <TextInput
            className="bg-surface rounded-xl px-4 py-3 text-text"
            placeholder="이메일을 입력해주세요"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
          />
        </View>

        <View className="mb-4">
          <Text className="text-text font-medium mb-2">연락처</Text>
          <TextInput
            className="bg-surface rounded-xl px-4 py-3 text-text"
            placeholder="연락처를 입력해주세요"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4">
          <Text className="text-text font-medium mb-2">문의 내용</Text>
          <TextInput
            className="bg-surface rounded-xl px-4 py-3 text-text h-32"
            placeholder="프로젝트에 대해 알려주세요"
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable className="bg-primary rounded-xl py-4 flex-row items-center justify-center">
          <Send size={18} color="#ffffff" />
          <Text className="text-white font-bold text-base ml-2">
            문의 보내기
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
