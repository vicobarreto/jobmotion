"""Gera um WAV com o Piper (voz local, sem internet). Chamado pelo motor "piper" do narrar.mjs.

uso: python piper_falar.py <modelo.onnx> <texto.txt> <saida.wav> [escala] [noise_scale] [noise_w]

escala (length_scale): maior = fala mais devagar. 1.0 é o padrão do modelo.
"""
import sys
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig


def numero(valor, padrao):
    return float(valor) if valor not in (None, "", "-") else padrao


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    modelo, texto_arquivo, saida = sys.argv[1:4]
    resto = sys.argv[4:] + [None, None, None]
    escala, ruido, ruido_w = numero(resto[0], 1.0), numero(resto[1], None), numero(resto[2], None)

    texto = Path(texto_arquivo).read_text(encoding="utf-8").strip()
    voz = PiperVoice.load(modelo)
    config = SynthesisConfig(length_scale=escala, noise_scale=ruido, noise_w_scale=ruido_w)
    with wave.open(saida, "wb") as w:
        voz.synthesize_wav(texto, w, syn_config=config)


if __name__ == "__main__":
    main()
