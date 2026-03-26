import ArrowDownIcon from '@/_icons/ArrowDownIcon';

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

export default function FaqItem(props: FaqItemProps) {
  const { question, answer, isOpen, onToggle } = props;

  return (
    <div className='border-t border-gray-200 py-5'>
      <button type='button' onClick={onToggle} className='flex w-full items-center gap-6 text-left'>
        <span className='flex-1 text-lg font-semibold tracking-[0.04em] text-black'>
          {question}
        </span>
        <ArrowDownIcon
          className={`size-7 shrink-0 fill-black transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen ? <p className='pt-4 pr-12 text-base leading-8 text-gray-700'>{answer}</p> : null}
    </div>
  );
}
