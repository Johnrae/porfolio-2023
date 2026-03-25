interface KeyData {
  key: string
  label: string
}

const ROW_A: KeyData[] = [
  { key: 'A', label: '♭ semi' },
  { key: 'S', label: 'freq −' },
  { key: 'D', label: 'freq +' },
  { key: 'F', label: '♯ semi' },
]

const ROW_Z: KeyData[] = [
  { key: 'Z', label: 'C3' },
  { key: 'X', label: 'D3' },
  { key: 'C', label: 'E3' },
  { key: 'V', label: 'F3' },
  { key: 'B', label: 'G3' },
  { key: 'N', label: 'A3' },
  { key: 'M', label: 'B3' },
  { key: ',', label: 'C4' },
  { key: '.', label: 'D4' },
]

interface KeyCapProps {
  keyData: KeyData
}

function KeyCap({ keyData }: KeyCapProps) {
  return (
    <div className='flex flex-col items-center justify-between w-10 h-12 rounded-lg border border-zinc-600 bg-zinc-800 px-1 pt-1.5 pb-1 select-none'>
      <span className='text-sm font-mono font-semibold text-zinc-200 leading-none'>{keyData.key}</span>
      <span className='text-[9px] font-mono text-zinc-400 leading-none text-center whitespace-nowrap'>
        {keyData.label}
      </span>
    </div>
  )
}

export default function KeyboardInstructions() {
  return (
    <div className='flex flex-col gap-1'>
      {/* A-row — offset by half a key width to mimic staggered keyboard layout */}
      <div className='flex gap-1' style={{ paddingLeft: '0px' }}>
        {ROW_A.map((k) => (
          <KeyCap key={k.key} keyData={k} />
        ))}
      </div>
      {/* Z-row */}
      <div className='flex gap-1' style={{ paddingLeft: '20px' }}>
        {ROW_Z.map((k) => (
          <KeyCap key={k.key} keyData={k} />
        ))}
      </div>
    </div>
  )
}
