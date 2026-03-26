import { type ComponentType, type RefObject, type SVGProps } from 'react';

import { tv } from 'tailwind-variants';

import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';
import BookIcon from '@/_icons/BookIcon';
import CalendarIcon from '@/_icons/CalendarIcon';
import CloseIcon from '@/_icons/CloseIcon';
import GroupsIcon from '@/_icons/GroupsIcon';
import HomeIcon from '@/_icons/HomeIcon';
import MosaicIcon from '@/_icons/MosaicIcon';
import NotificationsIcon from '@/_icons/NotificationsIcon';
import PersonIcon from '@/_icons/PersonIcon';
import ShareIcon from '@/_icons/ShareIcon';

type SidebarIcon = ComponentType<SVGProps<SVGSVGElement>>;

type DashboardPreviewProps = {
  calendarBodyScrollRef: RefObject<HTMLDivElement | null>;
  calendarHeaderScrollRef: RefObject<HTMLDivElement | null>;
  previewRef: RefObject<HTMLDivElement | null>;
  hasTriggeredAppointmentSwipe: boolean;
};

const previewCard = tv({
  base: 'rounded-[2rem] border border-gray-100 bg-white shadow-[0_24px_60px_-45px_rgba(12,16,21,0.4)]',
});

const sidebarItem = tv({
  base: 'mb-2 flex items-center gap-4 rounded-2xl px-4 py-3 text-[1.1rem]',
  variants: {
    active: {
      true: 'bg-primary-100 text-black',
      false: 'text-gray-800',
    },
  },
});

const topActionButton = tv({
  base: 'inline-flex shrink-0 items-center justify-center',
  variants: {
    tone: {
      dark: 'h-12 gap-3 rounded-[1.35rem] bg-[#141a23] px-8 text-lg font-medium whitespace-nowrap text-white',
      icon: 'size-12 rounded-full bg-white text-gray-700',
    },
  },
});

const filterChip = tv({
  base: 'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white text-[17px] text-gray-700',
  variants: {
    size: {
      default: 'px-4 py-[7px]',
      segmented: '',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const masterAvatar = tv({
  base: 'mx-auto flex size-12 items-center justify-center rounded-full text-2xl font-semibold text-black',
  variants: {
    tone: {
      primary: 'bg-primary-300',
      info: 'bg-blue-200',
      warm: 'bg-[#f3c18e]',
    },
  },
});

const currentTimeMarker = tv({
  base: 'w-fit rounded-full border bg-white px-2 py-0.5 text-sm',
  variants: {
    tone: {
      alert: 'border-[#8b3f35] text-[#8b3f35]',
    },
  },
});

const currentTimeLine = tv({
  base: 'relative z-0 h-px w-full',
  variants: {
    tone: {
      alert: 'bg-[#8b3f35]',
    },
  },
});

const calendarEvent = tv({
  base: 'absolute z-10 rounded-xl px-3 py-2 shadow-sm',
  variants: {
    status: {
      pending: 'border border-[#b99344] bg-white text-[#6e5422]',
      confirmed: 'border border-[#5d96cd] bg-[#f4f8ff] text-[#245091]',
      alert: 'border border-[#8b3f35] bg-[#fff8f8] text-[#8b3f35]',
      neutral: 'bg-gray-50 text-gray-700',
    },
  },
});

const eventStatusPill = tv({
  base: 'rounded-full px-2 py-0.5 text-sm text-white',
  variants: {
    status: {
      pending: 'bg-[#b99344]',
      confirmed: 'bg-[#1B5192]',
      alert: 'bg-[#8b3f35]',
    },
  },
});

const notificationCard = tv({
  base: 'rounded-2xl border px-4 py-3',
  variants: {
    highlighted: {
      true: 'border-primary-100 bg-primary-50/75',
      false: 'border-gray-100 bg-white',
    },
  },
});

const tinyInitialBadge = tv({
  base: 'flex size-5 items-center justify-center rounded-full text-xs font-semibold',
  variants: {
    tone: {
      primary: 'bg-primary-100 text-primary-700',
      warm: 'bg-[#f3c18e] text-[#7a5120]',
    },
  },
});

const appointmentAccent = tv({
  base: 'w-1 rounded-full',
  variants: {
    status: {
      confirmed: 'bg-[#1B5192]',
      alert: 'bg-[#8b3f35]',
    },
  },
});

const appointmentStatus = tv({
  base: 'rounded-full px-2 py-0.5 text-sm text-white',
  variants: {
    status: {
      confirmed: 'bg-[#1B5192]',
      alert: 'bg-[#8b3f35]',
    },
  },
});

export default function DashboardPreview(props: DashboardPreviewProps) {
  const {
    calendarBodyScrollRef,
    calendarHeaderScrollRef,
    previewRef,
    hasTriggeredAppointmentSwipe,
  } = props;
  const activeAppointmentSlide = hasTriggeredAppointmentSwipe ? 1 : 0;

  const sidebarItems: { label: string; Icon: SidebarIcon; active?: boolean }[] = [
    { label: 'Home', Icon: HomeIcon, active: true },
    { label: 'Calendar', Icon: CalendarIcon },
    { label: 'Clients', Icon: PersonIcon },
    { label: 'Services', Icon: BookIcon },
    { label: 'Masters', Icon: GroupsIcon },
    { label: 'Bookings', Icon: MosaicIcon },
  ];

  const calendarMasters = [
    { initial: 'J', name: 'Master Jade', tone: 'primary' as const },
    { initial: 'E', name: 'Master Emma', tone: 'info' as const },
    { initial: 'A', name: 'Master Anna', tone: 'warm' as const },
  ];

  const notificationItems = [
    { id: 1, highlighted: true },
    { id: 2, highlighted: false },
  ];

  const appointmentSlides = [
    {
      date: 'Today, 12 Sep',
      time: '09:15-10:15',
      status: 'alert' as const,
      statusLabel: 'Out of schedule',
      service: 'Haircut',
      duration: '1h 30min',
      initial: 'A',
      master: 'Master Anna',
      price: '65 Euro',
      clientLabel: 'Sophia Miller',
      clientValue: '0122-23-23-232',
      note: 'I have really long hair',
    },
    {
      date: 'Today, 12 Sep',
      time: '11:30-12:30',
      status: 'confirmed' as const,
      statusLabel: 'Confirmed',
      service: 'Color refresh',
      duration: '1h',
      initial: 'E',
      master: 'Master Emma',
      price: '55 Euro',
      clientLabel: 'Emily Carter',
      clientValue: '066-345-34-35',
      note: 'Client requested a quick refresh before the evening appointment.',
    },
  ];

  return (
    <div
      ref={previewRef}
      className='mx-auto overflow-hidden rounded-[2rem] border border-primary-100 bg-[#f5effb] shadow-[0_40px_110px_-70px_rgba(12,16,21,0.7)]'
    >
      <div className='grid xl:grid-cols-[260px_minmax(0,1fr)]'>
        <aside className='hidden min-h-full border-r border-gray-200 bg-white xl:flex xl:flex-col xl:justify-between'>
          <div>
            <div className='border-b border-gray-200 px-9 py-8 text-[2rem] font-semibold tracking-[-0.05em] text-gray-700'>
              Avoo
            </div>
            <nav className='px-6 py-4'>
              {sidebarItems.map((item) => (
                <div key={item.label} className={sidebarItem({ active: item.active ?? false })}>
                  <item.Icon className='size-6 fill-current text-gray-700' />
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className='space-y-2 px-9 py-8 text-sm text-gray-500'>
            <p>Terms of service</p>
            <p>Privacy Policy</p>
            <p>Help and support</p>
            <div className='mt-4 inline-flex items-center gap-2'>
              <span>English</span>
              <ArrowDownIcon className='size-4 fill-gray-500' />
            </div>
          </div>
        </aside>

        <div className='p-4 sm:p-6 xl:p-8'>
          <div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between'>
            <div className='flex items-start justify-between gap-3 rounded-2xl bg-primary-100/70 px-5 py-4 pr-1.5 text-sm leading-6 text-gray-700 xl:max-w-[720px]'>
              <p className='pr-2'>
                You have 5 bookings out of schedule. Please review them and update the calendar.
              </p>
              <button
                type='button'
                aria-label='Close notification'
                className='mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-gray-500'
              >
                <CloseIcon className='size-3 fill-current' />
              </button>
            </div>

            <div className='flex shrink-0 items-center gap-4 self-end xl:self-auto xl:pl-6'>
              <div className={topActionButton({ tone: 'dark' })}>
                <span>Add</span>
                <ArrowDownIcon className='size-5 fill-white' />
              </div>
              <button type='button' className={topActionButton({ tone: 'icon' })}>
                <ShareIcon className='size-5 fill-gray-700' />
              </button>
              <button type='button' className={topActionButton({ tone: 'icon' })}>
                <NotificationsIcon className='size-5 fill-gray-700' />
              </button>
              <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-200 text-2xl font-semibold text-gray-800'>
                S
              </div>
            </div>
          </div>

          <div className='mt-6 grid gap-6 2xl:grid-cols-[minmax(0,1.08fr)_420px]'>
            <div className={previewCard({ className: 'overflow-hidden' })}>
              <div className='px-5 pb-5 pt-6 sm:px-7'>
                <h3 className='text-[2rem] font-semibold tracking-[-0.04em] text-black'>
                  Calendar
                </h3>
              </div>
              <div className='flex flex-nowrap gap-2 border-y border-primary-100 bg-primary-50/55 px-4 py-3 sm:px-5'>
                <div className={filterChip()}>Today</div>
                <div className='flex items-center overflow-hidden rounded-full border border-gray-200 bg-white'>
                  <button type='button' className='px-3 py-[9px]'>
                    <ArrowBackIcon className='size-5 fill-gray-700' />
                  </button>
                  <span className='border-x border-gray-200 px-5 py-[7px] text-[17px] text-gray-700'>
                    Fri 12 Sep
                  </span>
                  <button type='button' className='px-3 py-[9px]'>
                    <ArrowForwardIcon className='size-5 fill-gray-700' />
                  </button>
                </div>
                <div className={filterChip()}>
                  <span>Day</span>
                  <ArrowDownIcon className='size-4 fill-gray-500' />
                </div>
                <div className={filterChip()}>
                  <span>Options</span>
                  <ArrowDownIcon className='size-4 fill-gray-500' />
                </div>
              </div>

              <div className='grid grid-cols-[58px_minmax(0,1fr)]'>
                <div className='border-b border-r border-gray-200 bg-white' />
                <div
                  ref={calendarHeaderScrollRef}
                  className='hide-scrollbar overflow-x-auto border-b border-gray-200'
                >
                  <div className='w-[calc(150%_-_29px)] min-w-[760px]'>
                    <div className='grid grid-cols-[repeat(3,minmax(0,1fr))] text-center'>
                      {calendarMasters.map((master) => (
                        <div
                          key={master.name}
                          className='border-l border-gray-200 px-3 py-4 first:border-l-0'
                        >
                          <div className={masterAvatar({ tone: master.tone })}>
                            {master.initial}
                          </div>
                          <p className='mt-3 text-xl leading-6 text-gray-800'>{master.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className='relative border-r border-gray-200 bg-white'>
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'].map((time) => (
                    <div
                      key={time}
                      className='flex h-[91px] items-start border-b border-gray-200 px-2 py-1 text-[1.15rem] text-black'
                    >
                      {time}
                    </div>
                  ))}

                  <div className='pointer-events-none absolute left-[6px] right-[-12px] top-[169px] z-20'>
                    <div className={currentTimeMarker({ tone: 'alert' })}>09:32</div>
                  </div>
                </div>

                <div ref={calendarBodyScrollRef} className='hide-scrollbar overflow-x-auto'>
                  <div className='relative h-[640px] w-[calc(150%_-_29px)] min-w-[760px] overflow-hidden bg-white'>
                    <div className='absolute inset-0 grid grid-cols-[repeat(3,minmax(0,1fr))]'>
                      {Array.from({ length: 3 }).map((_, colIndex) => (
                        <div
                          key={`grid-col-${colIndex}`}
                          className='border-r border-gray-200 last:border-r-0'
                        >
                          {Array.from({ length: 14 }).map((__, rowIndex) => (
                            <div
                              key={`grid-line-${colIndex}-${rowIndex}`}
                              className='h-[45.5px] border-b border-gray-100'
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className='pointer-events-none absolute inset-x-0 top-[182px] flex items-center'>
                      <div className={currentTimeLine({ tone: 'alert' })} />
                    </div>

                    <div
                      className={calendarEvent({
                        status: 'pending',
                        className: 'left-[8px] top-[274px] w-[calc((100%_/_3)_-_14px)]',
                      })}
                    >
                      <div className='flex items-start justify-between gap-2 text-[1.05rem] leading-5'>
                        <span>10:30 Anna Joy</span>
                        <span className={eventStatusPill({ status: 'pending' })}>Pending</span>
                      </div>
                      <p className='mt-2 text-[1.05rem] font-medium'>Haircut</p>
                    </div>

                    <div
                      className={calendarEvent({
                        status: 'confirmed',
                        className:
                          'left-[calc((100%_/_3)_+_8px)] top-[384px] w-[calc((100%_/_3)_-_14px)]',
                      })}
                    >
                      <p className='text-[1.05rem] leading-5'>11:30 3066-345-34-35</p>
                      <p className='mt-2 text-[1.05rem] font-medium'>Haircut</p>
                    </div>

                    <div
                      className={calendarEvent({
                        status: 'confirmed',
                        className: 'left-[8px] top-[577px] w-[calc((100%_/_3)_-_14px)]',
                      })}
                    >
                      <p className='text-[1.05rem] leading-5'>13:00 Anna Joy</p>
                      <p className='mt-2 text-[1.05rem] font-medium'>Haircut</p>
                    </div>

                    <div
                      className={calendarEvent({
                        status: 'alert',
                        className:
                          'left-[calc((100%_/_3)_*_2_+_8px)] top-[140px] w-[calc((100%_/_3)_-_14px)]',
                      })}
                    >
                      <div className='flex items-start justify-between gap-2 text-[1.05rem] leading-5'>
                        <span>09:15 Anna Joy</span>
                        <span className={eventStatusPill({ status: 'alert' })}>
                          Out of schedule
                        </span>
                      </div>
                      <p className='mt-2 text-[1.05rem] font-medium'>Haircut</p>
                    </div>

                    <div
                      className={calendarEvent({
                        status: 'neutral',
                        className:
                          'left-[calc((100%_/_3)_*_2_+_8px)] top-[635px] w-[calc((100%_/_3)_-_14px)] py-3',
                      })}
                    >
                      <p>13:30</p>
                      <p className='mt-2'>Personal Leave</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid gap-6'>
              <div className={previewCard({ className: 'p-6' })}>
                <h3 className='text-[2rem] font-semibold tracking-[-0.04em] text-black'>
                  New notifications
                </h3>
                <div className='mt-6 space-y-4'>
                  {notificationItems.map((item) => (
                    <div
                      key={`notification-${item.id}`}
                      className={notificationCard({ highlighted: item.highlighted })}
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <p className='text-[1.05rem] leading-6 text-black'>
                            09:30 Fri 24 Oct | Manicure
                          </p>
                          <p className='text-[1.05rem] leading-6 text-black'>
                            Client: (066) 234-34-34
                          </p>
                        </div>
                        <p className='text-sm text-gray-400'>24 mins ago</p>
                      </div>
                      <div className='mt-2 flex justify-end'>
                        <div className='inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm text-gray-600'>
                          <span className={tinyInitialBadge({ tone: 'warm' })}>A</span>
                          <span>Master Anna</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-lg text-gray-600'
                  >
                    <span>See all</span>
                    <ArrowForwardIcon className='size-4 fill-gray-500' />
                  </button>
                </div>
              </div>

              <div className={previewCard({ className: 'p-6' })}>
                <div className='w-full'>
                  <h3 className='whitespace-nowrap text-[2rem] font-semibold tracking-[-0.04em] text-black'>
                    Next appointments
                  </h3>
                </div>

                <div className='mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
                  <div
                    className='flex w-[200%] transition-transform duration-700 ease-out'
                    style={{
                      transform: `translateX(${hasTriggeredAppointmentSwipe ? '-50%' : '0%'})`,
                    }}
                  >
                    {appointmentSlides.map((slide) => (
                      <div key={`${slide.date}-${slide.time}`} className='w-1/2 p-4'>
                        <div className='flex gap-4'>
                          <div className={appointmentAccent({ status: slide.status })} />
                          <div className='min-w-0 flex-1'>
                            <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
                              <p className='text-[1.1rem] font-medium text-black'>{slide.date}</p>
                              <p className='text-[1.1rem] text-gray-600'>{slide.time}</p>
                              <span className={appointmentStatus({ status: slide.status })}>
                                {slide.statusLabel}
                              </span>
                            </div>

                            <p className='mt-5 text-[1.15rem] font-medium text-black'>
                              {slide.service}
                            </p>
                            <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.05rem] text-gray-600'>
                              <span>{slide.duration}</span>
                              <span>|</span>
                              <span className='inline-flex items-center gap-2'>
                                <span className={tinyInitialBadge({ tone: 'primary' })}>
                                  {slide.initial}
                                </span>
                                {slide.master}
                              </span>
                              <span>|</span>
                              <span>{slide.price}</span>
                            </div>

                            <div className='mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[1.05rem] text-black'>
                              <span className='font-medium'>{slide.clientLabel}</span>
                              <span>{slide.clientValue}</span>
                            </div>
                            <p className='mt-2 max-w-[28rem] text-[1.02rem] leading-6 text-gray-500'>
                              {slide.note}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-6 flex items-center justify-between'>
                  <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-lg text-gray-600'
                  >
                    <ArrowBackIcon className='size-4 fill-gray-500' />
                    <span>Back</span>
                  </button>
                  <div className='flex items-center gap-3'>
                    {[0, 1, 2, 3, 4].map((index) => (
                      <span
                        key={`dot-${index}`}
                        className={`h-3 w-3 rounded-full ${
                          index === activeAppointmentSlide ? 'bg-gray-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type='button'
                    className='inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-lg text-gray-600'
                  >
                    <span>Next</span>
                    <ArrowForwardIcon className='size-4 fill-gray-500' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
