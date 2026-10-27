import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const COLORS = {
  primary: '#D0300F',
  title: '#1F1510',
  text: '#2E3440',
  muted: '#7A7F87',
  card: '#FFFDF9',
  chip: '#F8EBD7',
  divider: '#EFE8DA',
  white: '#FFFFFF',
};

export type Customization = {
  temperature?: 'Hot' | 'Cold';
  spice?: 'Less spicy' | 'Medium' | 'More spicy';
  note?: string;
};

type Props = {
  visible: boolean;
  itemName: string;
  showTemperature?: boolean; // true for coffee, tea, drinks
  showSpice?: boolean; // true for food
  onCancel: () => void;
  onConfirm: (choices: Customization) => void;
};

function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value?: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function CustomizeSheet({
  visible,
  itemName,
  showTemperature = false,
  showSpice = false,
  onCancel,
  onConfirm,
}: Props) {
  const [temperature, setTemperature] = useState<Customization['temperature']>('Hot');
  const [spice, setSpice] = useState<Customization['spice']>('Medium');
  const [note, setNote] = useState('');

  // Reset to defaults every time the popup opens
  useEffect(() => {
    if (visible) {
      setTemperature('Hot');
      setSpice('Medium');
      setNote('');
    }
  }, [visible]);

  const handleConfirm = () => {
    const choices: Customization = {};
    if (showTemperature) choices.temperature = temperature;
    if (showSpice) choices.spice = spice;
    if (note.trim()) choices.note = note.trim();
    onConfirm(choices);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Customize your order</Text>
          <Text style={styles.itemName}>{itemName}</Text>

          {showTemperature && (
            <OptionRow label="Temperature" options={['Hot', 'Cold'] as const} value={temperature} onChange={setTemperature} />
          )}
          {showSpice && (
            <OptionRow
              label="Spice level"
              options={['Less spicy', 'Medium', 'More spicy'] as const}
              value={spice}
              onChange={setSpice}
            />
          )}

          <View style={styles.group}>
            <Text style={styles.groupLabel}>Special request (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="e.g. no onions, extra sauce"
              placeholderTextColor={COLORS.muted}
              value={note}
              onChangeText={setNote}
              maxLength={80}
            />
          </View>

          <Pressable style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.85 }]} onPress={handleConfirm}>
            <Text style={styles.addText}>Add to Cart</Text>
          </Pressable>
          <Pressable style={styles.cancel} onPress={onCancel} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: 30 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.title },
  itemName: { fontSize: 17, color: COLORS.muted, marginTop: 4, marginBottom: 18 },

  group: { marginBottom: 18 },
  groupLabel: { fontSize: 16, fontWeight: '700', color: COLORS.title, marginBottom: 10 },
  chipRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chip: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 22, backgroundColor: COLORS.chip },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 16, color: COLORS.title, fontWeight: '600' },
  chipTextActive: { color: COLORS.white },

  noteInput: {
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },

  addButton: { backgroundColor: COLORS.primary, borderRadius: 16, alignItems: 'center', paddingVertical: 18, marginTop: 4 },
  addText: { color: COLORS.white, fontSize: 20, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingTop: 16 },
  cancelText: { fontSize: 16, color: COLORS.muted, fontWeight: '600' },
});