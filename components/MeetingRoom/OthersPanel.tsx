import { Colors } from "@/constants/colors";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, G, Path, Svg, Text as SvgText } from "react-native-svg";
import CorrectVectorIcon from "@/assets/svg/correctVector.svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudentResult {
  id: string;
  name: string;
  score: number;
  total: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_RESULTS = {
  correct: 10,
  wrong: 5,
  unanswered: 5,
  total: 20,
  scorePercent: 80,
};

const MOCK_STUDENTS: StudentResult[] = [
  { id: "1", name: "يوستينا صلاح", score: 10, total: 20 },
  { id: "2", name: "يوستينا صلاح", score: 10, total: 20 },
  { id: "3", name: "يوستينا صلاح", score: 10, total: 20 },
  { id: "4", name: "يوستينا صلاح", score: 10, total: 20 },
];

const AVATAR_COLORS = ["#E89B32", "#d97706", "#b45309", "#92400e"];

// ─── Donut chart ──────────────────────────────────────────────────────────────

function DonutChart({
  correct,
  wrong,
  unanswered,
  total,
  percent,
}: {
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  percent: number;
}) {
  const SIZE = 200;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 76;
  const STROKE = 22;
  const GAP = 3;
  const C = 2 * Math.PI * R;

  const gapLen = (GAP / 360) * C;
  const cLen = C * (correct / total) - gapLen;
  const wLen = C * (wrong / total) - gapLen;
  const uLen = C * (unanswered / total) - gapLen;

  const cOff = -(C / 4);
  const wOff = cOff - cLen - gapLen;
  const uOff = wOff - wLen - gapLen;

  return (
    <Svg width={SIZE} height={SIZE}>
      <G rotation="-90" origin={`${cx},${cy}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={R}
          stroke="#F0F0F0"
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={R}
          stroke="#349E3E"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${cLen} ${C - cLen}`}
          strokeDashoffset={cOff}
          strokeLinecap="square"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={R}
          stroke="#E53E3E"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${wLen} ${C - wLen}`}
          strokeDashoffset={wOff}
          strokeLinecap="square"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={R}
          stroke="#C0C0C0"
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${uLen} ${C - uLen}`}
          strokeDashoffset={uOff}
          strokeLinecap="square"
        />
      </G>
      <SvgText
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize="12"
        fontFamily="Alex_400"
        fill="#888"
      >
        اجمالي النتيجة
      </SvgText>
      <SvgText
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontSize="26"
        fontFamily="Alex_700"
        fill="#1B3A4B"
      >
        {percent}%
      </SvgText>
    </Svg>
  );
}

// ─── Legend dot ───────────────────────────────────────────────────────────────

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={op.legendItem}>
      <Text style={op.legendLabel}>{label}</Text>
      <View style={[op.legendDot, { backgroundColor: color }]} />
    </View>
  );
}

// ─── Stat box ─────────────────────────────────────────────────────────────────

function StatBox({
  count,
  label,
  icon,
}: {
  count: number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <View style={op.statBox}>
      <Text style={op.statLabel}>{label}</Text>
      <View style={op.statRow}>
        <View>{icon}</View>
        <Text style={op.statCount}>{count}</Text>
      </View>
    </View>
  );
}

// ─── Student row ──────────────────────────────────────────────────────────────

function StudentRow({
  student,
  index,
}: {
  student: StudentResult;
  index: number;
}) {
  const pct = Math.round((student.score / student.total) * 100);
  return (
    <View style={op.studentRow}>
      <Text style={op.studentScore}>
        ({pct}%) {student.score}/{student.total}
      </Text>
      <Text style={op.studentName}>{student.name}</Text>
      <View
        style={[
          op.studentAvatar,
          { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] },
        ]}
      >
        <Text style={op.studentAvatarText}>{student.name[0]}</Text>
      </View>
    </View>
  );
}

// ─── Ranking tab placeholder ──────────────────────────────────────────────────

function RankingTab() {
  const sorted = [...MOCK_STUDENTS].sort((a, b) => b.score - a.score);
  return (
    <View style={op.rankList}>
      {sorted.map((s, i) => {
        const pct = Math.round((s.score / s.total) * 100);
        const medals = ["🥇", "🥈", "🥉"];
        return (
          <View key={s.id + i} style={op.rankRow}>
            <Text style={op.rankScore}>
              ({pct}%) {s.score}/{s.total}
            </Text>
            <Text style={op.rankName}>{s.name}</Text>
            <View style={op.rankLeft}>
              <Text style={op.rankMedal}>{medals[i] ?? `#${i + 1}`}</Text>
              <View
                style={[
                  op.studentAvatar,
                  { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] },
                ]}
              >
                <Text style={op.studentAvatarText}>{s.name[0]}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ─── Results tab ─────────────────────────────────────────────────────────────

function ResultsTab() {
  const { correct, wrong, unanswered, total, scorePercent } = MOCK_RESULTS;
  return (
    <>
      {/* Donut chart */}
      <View style={op.chartWrap}>
        <DonutChart
          correct={correct}
          wrong={wrong}
          unanswered={unanswered}
          total={total}
          percent={scorePercent}
        />
      </View>

      {/* Legend */}
      <View style={op.legend}>
        <LegendDot color="#C0C0C0" label="غير مجابة" />
        <LegendDot color="#E53E3E" label="اجابة خطأ" />
        <LegendDot color="#349E3E" label="اجابة صحيحة" />
      </View>

      {/* Stat boxes */}
      <View style={op.statsRow}>
        <StatBox
          count={unanswered}
          label="غير مجابة"
          icon={
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Path d="M4 9H14" stroke="#888" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          }
        />
        <StatBox
          count={wrong}
          label="اجابة خطأ"
          icon={
            <Svg width={18} height={18} viewBox="0 0 17 17">
              <Path
                d="M15.9043 13.5905C16.0606 13.7414 16.1852 13.922 16.271 14.1216C16.3568 14.3213 16.4019 14.536 16.4038 14.7533C16.4057 14.9705 16.3643 15.186 16.282 15.3871C16.1997 15.5882 16.0782 15.7709 15.9246 15.9246C15.7709 16.0782 15.5882 16.1997 15.3871 16.282C15.186 16.3643 14.9705 16.4057 14.7533 16.4038C14.536 16.4019 14.3213 16.3568 14.1216 16.271C13.922 16.1852 13.7414 16.0606 13.5905 15.9043L8.20192 10.5157L2.81338 15.9043C2.49429 16.2234 2.07538 16.3837 1.65647 16.3837C1.23756 16.3837 0.818654 16.2242 0.499563 15.9043C0.192792 15.5974 0.0204575 15.1813 0.0204575 14.7474C0.0204575 14.3135 0.192792 13.8973 0.499563 13.5905L5.88811 8.20192L0.499563 2.81338C0.343273 2.66243 0.218611 2.48187 0.132851 2.28222C0.047091 2.08258 0.00194985 1.86786 6.17843e-05 1.65058C-0.00182628 1.43331 0.0395762 1.21783 0.121854 1.01673C0.204132 0.815625 0.325637 0.632922 0.479279 0.479279C0.632922 0.325637 0.815625 0.204132 1.01673 0.121854C1.21783 0.0395762 1.43331 -0.00182628 1.65058 6.17843e-05C1.86786 0.00194985 2.08258 0.047091 2.28222 0.132851C2.48187 0.218611 2.66243 0.343273 2.81338 0.499563L8.20192 5.88811L13.5905 0.499563C13.7414 0.343273 13.922 0.218611 14.1216 0.132851C14.3213 0.047091 14.536 0.00194985 14.7533 6.17843e-05C14.9705 -0.00182628 15.186 0.0395762 15.3871 0.121854C15.5882 0.204132 15.7709 0.325637 15.9246 0.479279C16.0782 0.632922 16.1997 0.815625 16.282 1.01673C16.3643 1.21783 16.4057 1.43331 16.4038 1.65058C16.4019 1.86786 16.3568 2.08258 16.271 2.28222C16.1852 2.48187 16.0606 2.66243 15.9043 2.81338L10.5157 8.20192L15.9043 13.5905Z"
                fill="#E53E3E"
              />
            </Svg>
          }
        />
        <StatBox
          count={correct}
          label="اجابة صحيحة"
          icon={<CorrectVectorIcon width={20} height={18} />}
        />
      </View>

      {/* Distribution */}
      <Text style={op.sectionTitle}>توزيع الاجابات</Text>
      {MOCK_STUDENTS.map((s, i) => (
        <StudentRow key={s.id + i} student={s} index={i} />
      ))}
    </>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

type Tab = "results" | "ranking";

export function OthersPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("results");

  return (
    <View style={op.panel}>
      {/* Header */}
      <View style={op.header}>
        <TouchableOpacity style={op.closeBtn} onPress={onClose}>
          <X size={18} color="#444" />
        </TouchableOpacity>
        <Text style={op.headerTitle}>نتائج</Text>
      </View>
      <View style={op.divider} />

      {/* Tab toggle */}
      <View style={op.tabToggle}>
        {(["results", "ranking"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[op.tabBtn, tab === t && op.tabBtnActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.8}
          >
            <Text style={[op.tabText, tab === t && op.tabTextActive]}>
              {t === "results" ? "نتائج" : "ترتيب"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={op.scroll}
      >
        {tab === "results" ? <ResultsTab /> : <RankingTab />}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const op = StyleSheet.create({
  panel: { flex: 1, backgroundColor: "#fff" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontFamily: "Alex_700", fontSize: 20, color: "#1B3A4B" },
  divider: { height: 1, backgroundColor: "#E8E8E8" },

  /* Tab toggle */
  tabToggle: {
    flexDirection: "row",
    marginHorizontal: "auto" as any,
    marginVertical: 16,
    width: "70%",
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 50,
  },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabText: {
    fontFamily: "Alex_500",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tabTextActive: { fontFamily: "Alex_700", color: "#fff" },

  /* Scroll */
  scroll: { paddingHorizontal: 16, paddingBottom: 32, gap: 16 },

  /* Donut */
  chartWrap: { alignItems: "center" },

  /* Legend */
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontFamily: "Alex_400", fontSize: 12, color: "#555" },

  /* Stat boxes */
  statsRow: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    alignItems: "flex-end",
    gap: 6,
  },
  statRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    // alignSelf: "flex-end",
  },
  statLabel: { fontFamily: "Alex_400", fontSize: 12, color: "#555" },
  statCount: { fontFamily: "Alex_700", fontSize: 20, color: "#1B3A4B" },

  /* Section title */
  sectionTitle: {
    fontFamily: "Alex_700",
    fontSize: 15,
    color: "#1B3A4B",
    textAlign: "right",
  },

  /* Student rows */
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  studentAvatarText: { fontFamily: "Alex_700", fontSize: 15, color: "#fff" },
  studentName: {
    flex: 1,
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#1B3A4B",
    textAlign: "right",
    marginHorizontal: 10,
  },
  studentScore: { fontFamily: "Alex_400", fontSize: 13, color: "#888" },

  /* Ranking tab */
  rankList: { gap: 4 },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  rankLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  rankMedal: { fontSize: 20 },
  rankName: {
    flex: 1,
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#1B3A4B",
    textAlign: "right",
    marginHorizontal: 10,
  },
  rankScore: { fontFamily: "Alex_400", fontSize: 13, color: "#888" },
});
