interface SubtitleBlock {
  number: string;
  timestamp: string;
  text: string[];
}

export function convertSrtToVtt(srtContent: string): string {
  // Adiciona o cabeçalho WEBVTT
  let vttContent = 'WEBVTT\n\n';

  // Remove caracteres BOM se presentes
  srtContent = srtContent.replace(/^\uFEFF/, '');

  // Divide o conteúdo em blocos
  const blocks = srtContent.trim().split(/\n\s*\n/);

  // Processa cada bloco
  blocks.forEach((block) => {
    const lines = block.split('\n');
    if (lines.length < 3) return; // Pula blocos inválidos

    // Remove o número da legenda
    lines.shift();

    // Converte o tempo de SRT para VTT
    const timeLine = lines[0].replace(',', '.');

    // Junta as linhas de texto
    const textLines = lines.slice(1).join('\n');

    // Adiciona o bloco convertido
    vttContent += `${timeLine}\n${textLines}\n\n`;
  });

  return vttContent;
}

export function addNumbersToVtt(vttContent: string): string {
  // Verifica se é um arquivo VTT válido
  if (!vttContent.trim().startsWith('WEBVTT')) {
    throw new Error('Invalid VTT file: Must start with WEBVTT');
  }

  // Divide o conteúdo em linhas
  const lines = vttContent.split('\n');
  let output = lines[0] + '\n\n'; // Mantém o cabeçalho WEBVTT
  let counter = 1;

  // Processa o resto do arquivo
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Se encontrar uma linha de tempo (00:00:00.000 --> 00:00:00.000)
    if (line.match(/\d{2}:\d{2}:\d{2}\.\d{3}\s-->\s\d{2}:\d{2}:\d{2}\.\d{3}/)) {
      // Adiciona o número antes do tempo
      output += counter + '\n' + line + '\n';
      counter++;
    } else {
      // Mantém as outras linhas como estão
      output += line + '\n';
    }
  }

  return output;
}

export function removeNumbersFromVtt(vttContent: string): string {
  // Verifica se é um arquivo VTT válido
  if (!vttContent.trim().startsWith('WEBVTT')) {
    throw new Error('Invalid VTT file: Must start with WEBVTT');
  }

  // Divide o conteúdo em linhas
  const lines = vttContent.split('\n');
  let output = lines[0] + '\n\n'; // Mantém o cabeçalho WEBVTT
  let skipNextLine = false;

  // Processa o resto do arquivo
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Se a próxima linha é um timestamp, esta linha é um número
    if (i + 1 < lines.length && 
        lines[i + 1].match(/\d{2}:\d{2}:\d{2}\.\d{3}\s-->\s\d{2}:\d{2}:\d{2}\.\d{3}/)) {
      continue; // Pula esta linha (número)
    }
    
    // Adiciona todas as outras linhas
    output += line + '\n';
  }

  return output;
}