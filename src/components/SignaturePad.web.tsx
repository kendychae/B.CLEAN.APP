// Web: react-native-signature-canvas uses WebView which is not supported on web.
// This stub provides a compatible interface using an HTML canvas element.
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onOK?: (signature: string) => void;
  onEmpty?: () => void;
  descriptionText?: string;
  clearText?: string;
  confirmText?: string;
  webStyle?: string;
}

export interface SignaturePadRef {
  readSignature: () => void;
  clearSignature: () => void;
}

const SignaturePad = forwardRef<SignaturePadRef, Props>(
  ({ onOK, onEmpty, descriptionText = 'Sign here', clearText = 'Clear', confirmText = 'Save' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);

    useImperativeHandle(ref, () => ({
      readSignature: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        if (canvas.toDataURL() === blank.toDataURL()) {
          onEmpty?.();
        } else {
          onOK?.(canvas.toDataURL('image/png'));
        }
      },
      clearSignature: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
    }));

    const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      drawing.current = true;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      ctx?.beginPath();
      ctx?.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    };

    const endDraw = () => { drawing.current = false; };

    const handleClear = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const handleSave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const blank = document.createElement('canvas');
      blank.width = canvas.width;
      blank.height = canvas.height;
      if (canvas.toDataURL() === blank.toDataURL()) {
        onEmpty?.();
      } else {
        onOK?.(canvas.toDataURL('image/png'));
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.label}>{descriptionText}</Text>
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          style={{ border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'crosshair', touchAction: 'none' } as any}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
        />
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearText}>{clearText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default SignaturePad;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center' },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  buttons: { flexDirection: 'row', marginTop: 12, gap: 12 },
  clearBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  clearText: { color: '#555' },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, backgroundColor: '#4CBB17' },
  saveText: { color: '#fff', fontWeight: '600' },
});
