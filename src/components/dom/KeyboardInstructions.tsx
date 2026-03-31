interface KeyData {
  key: string
  label: string
  wide?: boolean
}

// Modifier / transpose row
const ROW_Q: KeyData[] = [
  { key: 'Q', label: '+semi' },
  { key: 'W', label: '−semi' },
  { key: 'E', label: 'freq−' },
  { key: 'R', label: 'freq+' },
]

// Home-row notes  (A = B2 … L = Eb4)
const ROW_A: KeyData[] = [
  { key: 'A', label: 'B2' },
  { key: 'S', label: 'C3' },
  { key: 'D', label: 'D3' },
  { key: 'F', label: 'Eb3' },
  { key: 'G', label: 'G3' },
  { key: 'H', label: 'A3' },
  { key: 'J', label: 'B3' },
  { key: 'K', label: 'C#4' },
  { key: 'L', label: 'Eb4' },
]

// Bottom-row notes  (Z = C3 … . = D4)
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
    <div
      className={`flex flex-col items-center justify-between h-11 rounded border border-zinc-700 bg-zinc-900 px-1 pt-1.5 pb-1 select-none ${keyData.wide ? 'w-12' : 'w-9'}`}>
      <span className='text-xs font-mono font-semibold text-zinc-200 leading-none'>{keyData.key}</span>
      <span className='text-[8px] font-mono text-zinc-500 leading-none text-center whitespace-nowrap'>
        {keyData.label}
      </span>
    </div>
  )
}

export default function KeyboardInstructions() {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex gap-1'>
        {ROW_Q.map((k) => (
          <KeyCap key={k.key} keyData={k} />
        ))}
      </div>
      <div className='flex gap-1' style={{ paddingLeft: '14px' }}>
        {ROW_A.map((k) => (
          <KeyCap key={k.key} keyData={k} />
        ))}
      </div>
      <div className='flex gap-1' style={{ paddingLeft: '22px' }}>
        {ROW_Z.map((k) => (
          <KeyCap key={k.key} keyData={k} />
        ))}
      </div>
    </div>
  )
}
