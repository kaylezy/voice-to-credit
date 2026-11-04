import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { isDebt, useTransactionDraft, type PayStatus, type TxType } from "../hooks/useTransactionDraft";

const TYPES: { value: TxType; label: string }[] = [
  { value: "sale", label: "Sale" },
  { value: "purchase", label: "Purchase" },
  { value: "expense", label: "Expense" },
  { value: "receivable", label: "Receivable" },
  { value: "payable", label: "Payable" },
];

const STATUSES: { value: PayStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "partially_paid", label: "Partially" },
  { value: "unpaid", label: "Unpaid" },
];

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.pillsRow}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            style={[styles.pill, selected && styles.pillSelected]}
            onPress={() => onChange(o.value)}
          >
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function TransactionForm() {
  const { draft, update } = useTransactionDraft();
  const debt = isDebt(draft.type);

  return (
    <View style={styles.formCard}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Transaction type</Text>
        <Pills
          options={TYPES}
          value={draft.type}
          onChange={(type) =>
            update({
              type,
              // Debts start as unpaid; everything else starts as paid
              status: type === "receivable" || type === "payable" ? "unpaid" : "paid",
            })
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Product / description <Text style={styles.star}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={draft.product}
          onChangeText={(product) => update({ product })}
          placeholder="e.g. Ankara"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.rowInputs}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            value={draft.quantity}
            onChangeText={(quantity) => update({ quantity })}
            keyboardType="numeric"
            placeholder="20"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Unit</Text>
          <TextInput
            style={styles.input}
            value={draft.unit}
            onChangeText={(unit) => update({ unit })}
            placeholder="yards"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Amount (₦) <Text style={styles.star}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={draft.amount}
          onChangeText={(amount) => update({ amount })}
          keyboardType="numeric"
          placeholder="80000"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <View style={styles.dropdown}>
          <TextInput
            style={styles.inputFlex}
            value={draft.date}
            onChangeText={(date) => update({ date })}
            placeholder="Today or 12/03/2026"
            placeholderTextColor="#9ca3af"
          />
          <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        </View>
      </View>

      {draft.type !== "expense" && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {debt ? "Customer / supplier" : "Customer / supplier (optional)"}
            {debt && <Text style={styles.star}> *</Text>}
          </Text>
          <TextInput
            style={styles.input}
            value={draft.party}
            onChangeText={(party) => update({ party })}
            placeholder={draft.type === "payable" || draft.type === "purchase" ? "Supplier name" : "Customer name"}
            placeholderTextColor="#9ca3af"
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Payment status</Text>
        <Pills options={STATUSES} value={draft.status} onChange={(status) => update({ status })} />
      </View>

      {debt && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due date (optional)</Text>
          <View style={styles.dropdown}>
            <TextInput
              style={styles.inputFlex}
              value={draft.dueDate}
              onChangeText={(dueDate) => update({ dueDate })}
              placeholder="30/11/2026"
              placeholderTextColor="#9ca3af"
            />
            <Ionicons name="calendar-outline" size={18} color="#6b7280" />
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Add a note..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          value={draft.notes}
          onChangeText={(notes) => update({ notes })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: { backgroundColor: "#ffffff", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 },
  star: { color: "#ef4444" },
  input: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, height: 46, paddingHorizontal: 16, fontSize: 14, color: "#1f2937" },
  inputFlex: { flex: 1, fontSize: 14, color: "#1f2937" },
  rowInputs: { flexDirection: "row" },
  dropdown: { flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, height: 46, paddingHorizontal: 16 },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pill: { paddingHorizontal: 14, height: 38, borderRadius: 10, borderWidth: 1, borderColor: "#d1d5db", backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" },
  pillSelected: { backgroundColor: "#0b4f8c", borderColor: "#0b4f8c" },
  pillText: { fontSize: 13, fontWeight: "600", color: "#4b5563" },
  pillTextSelected: { color: "#ffffff" },
  textArea: { backgroundColor: "#ffffff", borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, height: 90, paddingHorizontal: 16, paddingTop: 12, fontSize: 14, color: "#1f2937", textAlignVertical: "top" },
});