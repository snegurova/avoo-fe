'use client';

import { type MouseEventHandler, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AnchorButton from '@/_components/AnchorButton/AnchorButton';
import DashboardPreview from '@/_components/DashboardPreview/DashboardPreview';
import FaqItem from '@/_components/FaqItem/FaqItem';
import FeatureCard from '@/_components/FeatureCard/FeatureCard';
import FormInput from '@/_components/FormInput/FormInput';
import LanguageSwitcher from '@/_components/LanguageSwitcher/LanguageSwitcher';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import LogoMark from '@/_components/LogoMark/LogoMark';
import PricingCard from '@/_components/PricingCard/PricingCard';
import SectionTitle from '@/_components/SectionTitle/SectionTitle';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import TestimonialSpotlight, {
  type ReviewSlide,
} from '@/_components/TestimonialSpotlight/TestimonialSpotlight';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';
import CalendarClockIcon from '@/_icons/CalendarClockIcon';
import CloseIcon from '@/_icons/CloseIcon';
import MenuIcon from '@/_icons/MenuIcon';
import NotificationsIcon from '@/_icons/NotificationsIcon';
import VisibilityIcon from '@/_icons/VisibilityIcon';
import decorImage from '@/_images/beautiful-shot-makeup-brush-isolated-black-background.webp';
import review1Image from '@/_images/review-1.webp';
import review2Image from '@/_images/review-2.webp';
import { AppRoutes } from '@/_routes/routes';

const landingFieldClassNames = {
  container: 'w-full',
  input:
    'h-12 w-full rounded-none border-0 border-b border-gray-200 bg-transparent px-0 pr-10 pb-2 pt-1 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-0',
  error: 'mt-1 text-sm text-red-500',
} as const;

const calendarScrollStartOffset = 180;
const appointmentSwipeTriggerPoint = 0.58;

export default function LandingPage() {
  const t = useTranslations('public.home');
  const tSignUp = useTranslations('public.signUp.form');
  const router = useRouter();
  const toast = useToast();
  const isPending = useApiStatusStore((state) => state.isPending);
  const homeRedirect = localizationHooks.useWithLocale(AppRoutes.Home);
  const headerRef = useRef<HTMLElement>(null);
  const dashboardPreviewRef = useRef<HTMLDivElement>(null);
  const calendarHeaderScrollRef = useRef<HTMLDivElement>(null);
  const calendarBodyScrollRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([0, 1, 2, 3]);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [hasTriggeredAppointmentSwipe, setHasTriggeredAppointmentSwipe] = useState(false);
  const [activeReviewSlide, setActiveReviewSlide] = useState(0);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register: registerSignupField,
    handleSubmit: handleSignupSubmit,
    errors: signupErrors,
  } = authHooks.useRegisterForm({
    onSuccess: () => {
      router.push(homeRedirect);
      toast.success(tSignUp('welcomeMessage'));
    },
    onError: () => {
      toast.error(tSignUp('registerError'));
    },
  });

  const scrollToCreateProfileButton: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    document
      .getElementById('create-profile')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCreateProfile: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    document
      .getElementById('create-profile')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileMenuOpen(false);
  };

  const navItems = [
    { href: '#features', label: t('navigation.features') },
    { href: '#reviews', label: t('navigation.reviews') },
    { href: '#create-profile', label: t('navigation.createProfile') },
    { href: '#faq', label: t('navigation.faq') },
  ];

  const headerLinkClassName =
    'relative inline-block text-sm font-normal text-gray-600 transition-colors duration-200 hover:text-black after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100';

  const featureCards = [
    {
      step: '01',
      title: t('featureSection.items.scheduling.title'),
      description: t('featureSection.items.scheduling.description'),
      stat: t('featureSection.items.scheduling.stat'),
      Icon: CalendarClockIcon,
    },
    {
      step: '02',
      title: t('featureSection.items.reminders.title'),
      description: t('featureSection.items.reminders.description'),
      stat: t('featureSection.items.reminders.stat'),
      Icon: NotificationsIcon,
    },
    {
      step: '03',
      title: t('featureSection.items.portfolio.title'),
      description: t('featureSection.items.portfolio.description'),
      stat: t('featureSection.items.portfolio.stat'),
      Icon: VisibilityIcon,
    },
  ];

  const roiStats = [
    {
      label: t('featureSection.calculator.stats.hours.label'),
      value: t('featureSection.calculator.stats.hours.value'),
    },
    {
      label: t('featureSection.calculator.stats.noShows.label'),
      value: t('featureSection.calculator.stats.noShows.value'),
    },
    {
      label: t('featureSection.calculator.stats.repeat.label'),
      value: t('featureSection.calculator.stats.repeat.value'),
    },
  ];

  const reviewSlides: ReviewSlide[] = [
    {
      quote: t('testimonial.quote'),
      author: t('testimonial.author'),
      role: t('testimonial.role'),
      company: t('testimonial.company'),
      imageSrc: review1Image.src,
      imageAlt: 'Salon owner portrait',
    },
    {
      quote: t('testimonial.second.quote'),
      author: t('testimonial.second.author'),
      role: t('testimonial.second.role'),
      company: t('testimonial.company'),
      imageSrc: review2Image.src,
      imageAlt: 'Nail stylist portrait',
    },
  ];

  const pricingPlans = [
    {
      title: t('pricing.free.title'),
      subtitle: t('pricing.free.subtitle'),
      price: t('pricing.free.price'),
      suffix: t('pricing.planSuffix'),
      features: [
        t('pricing.free.feature1'),
        t('pricing.free.feature2'),
        t('pricing.free.feature3'),
        t('pricing.free.feature4'),
        t('pricing.free.feature5'),
        t('pricing.free.feature6'),
      ],
      featured: false,
    },
    {
      title: t('pricing.basic.title'),
      subtitle: t('pricing.basic.subtitle'),
      price: t('pricing.basic.price'),
      suffix: t('pricing.planSuffix'),
      features: [
        t('pricing.basic.feature1'),
        t('pricing.basic.feature2'),
        t('pricing.basic.feature3'),
        t('pricing.basic.feature4'),
        t('pricing.basic.feature5'),
        t('pricing.basic.feature6'),
        t('pricing.basic.feature7'),
      ],
      featured: false,
    },
    {
      title: t('pricing.business.title'),
      subtitle: t('pricing.business.subtitle'),
      price: t('pricing.business.price'),
      suffix: t('pricing.planSuffix'),
      features: [
        t('pricing.business.feature1'),
        t('pricing.business.feature2'),
        t('pricing.business.feature3'),
        t('pricing.business.feature4'),
        t('pricing.business.feature5'),
        t('pricing.business.feature6'),
        t('pricing.business.feature7'),
        t('pricing.business.feature9'),
        t('pricing.business.feature10'),
      ],
      featured: true,
    },
  ];

  const faqEntries = [
    {
      question: t('faq.items.free.question'),
      answer: t('faq.items.free.answer'),
    },
    {
      question: t('faq.items.size.question'),
      answer: t('faq.items.size.answer'),
    },
    {
      question: t('faq.items.skills.question'),
      answer: t('faq.items.skills.answer'),
    },
    {
      question: t('faq.items.setup.question'),
      answer: t('faq.items.setup.answer'),
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqs((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  const goToPreviousReview = () => {
    setActiveReviewSlide((current) => (current === 0 ? reviewSlides.length - 1 : current - 1));
  };

  const goToNextReview = () => {
    setActiveReviewSlide((current) => (current === reviewSlides.length - 1 ? 0 : current + 1));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 0);

      const calendarScroller = calendarBodyScrollRef.current;
      const calendarHeaderScroller = calendarHeaderScrollRef.current;
      const dashboardPreview = dashboardPreviewRef.current;
      const stickyHeader = headerRef.current;

      if (!calendarScroller || !dashboardPreview) {
        return;
      }

      const maxScrollLeft = calendarScroller.scrollWidth - calendarScroller.clientWidth;

      if (maxScrollLeft <= 0) {
        return;
      }

      const headerHeight = stickyHeader?.offsetHeight ?? 0;
      const { top, height } = dashboardPreview.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(
          0,
          (headerHeight + calendarScrollStartOffset - top) / Math.max(height - headerHeight, 1),
        ),
      );

      const scrollLeft = maxScrollLeft * progress;

      setHasTriggeredAppointmentSwipe(progress >= appointmentSwipeTriggerPoint);
      calendarScroller.scrollLeft = scrollLeft;

      if (calendarHeaderScroller) {
        calendarHeaderScroller.scrollLeft = scrollLeft;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id='top' className='bg-white text-black'>
      <header
        ref={headerRef}
        className={`sticky top-0 z-30 border-b bg-white/90 backdrop-blur ${isHeaderScrolled ? 'border-gray-100' : 'border-transparent'}`}
      >
        <div className='container mx-auto px-5 lg:px-8'>
          <div className='flex items-center justify-between gap-4 py-4'>
            <a href='#top' className='shrink-0'>
              <LogoMark />
            </a>

            <nav className='hidden items-center gap-11 lg:flex'>
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className={headerLinkClassName}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className='hidden items-center gap-2 lg:flex'>
              <LanguageSwitcher type='public' />
              <LocalizedLink
                href={AppRoutes.SignIn}
                className='px-4 py-2 text-sm font-normal text-gray-600 transition-colors duration-200 hover:text-black'
              >
                <span className={headerLinkClassName}>{t('navigation.login')}</span>
              </LocalizedLink>
              <AnchorButton
                href='#create-profile'
                variant='primary'
                onClick={scrollToCreateProfile}
              >
                {t('navigation.joinForFree')}
              </AnchorButton>
            </div>

            <button
              type='button'
              onClick={() => setMobileMenuOpen((value) => !value)}
              className='inline-flex size-11 items-center justify-center rounded-xl border border-gray-200 text-black lg:hidden'
              aria-label={mobileMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
            >
              {mobileMenuOpen ? (
                <CloseIcon className='size-6 fill-black' />
              ) : (
                <MenuIcon className='size-6 fill-black' />
              )}
            </button>
          </div>

          {mobileMenuOpen ? (
            <div className='border-t border-gray-100 pb-5 pt-4 lg:hidden'>
              <nav className='flex flex-col gap-3'>
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className='rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50'
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className='mt-4 flex flex-col gap-3'>
                <LocalizedLink
                  href={AppRoutes.SignIn}
                  className='rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700'
                >
                  {t('navigation.login')}
                </LocalizedLink>
                <AnchorButton
                  href='#create-profile'
                  variant='primary'
                  onClick={scrollToCreateProfile}
                >
                  {t('navigation.joinForFree')}
                </AnchorButton>
              </div>

              <div className='mt-4 w-fit'>
                <LanguageSwitcher type='public' />
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main>
        <section className='relative overflow-hidden'>
          <div className='container mx-auto px-5 pb-16 lg:px-8 lg:pb-28'>
            <div className='relative pb-20 pt-24 lg:pb-24 lg:pt-28'>
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(160,99,196,0.14),rgba(255,255,255,0)_70%)]' />
              <div className='relative mx-auto max-w-5xl text-center'>
                <h1 className='text-balance text-[2.8rem] font-semibold leading-[1.02] tracking-[-0.04em] text-black sm:text-[3.75rem] lg:text-[4.7rem]'>
                  {t('hero.title')}
                </h1>
                <p className='mx-auto mt-10 max-w-3xl text-balance text-[1rem] font-medium uppercase leading-[1.46] tracking-[0.24em] text-primary-700 sm:text-[1.08rem] lg:text-[1.15rem]'>
                  {t('hero.subtitle')}
                </p>
                <div className='mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center'>
                  <AnchorButton
                    href='#create-profile'
                    variant='primary'
                    onClick={scrollToCreateProfile}
                  >
                    {t('hero.primaryCta')}
                  </AnchorButton>
                </div>
              </div>
            </div>

            <DashboardPreview
              calendarBodyScrollRef={calendarBodyScrollRef}
              calendarHeaderScrollRef={calendarHeaderScrollRef}
              previewRef={dashboardPreviewRef}
              hasTriggeredAppointmentSwipe={hasTriggeredAppointmentSwipe}
            />
          </div>
        </section>

        <section id='features' className='scroll-mt-28 bg-gray-50/70'>
          <div className='container mx-auto px-5 py-16 lg:px-8 lg:py-24'>
            <div className='grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start'>
              <div>
                <SectionTitle
                  eyebrow={t('featureSection.eyebrow')}
                  title={t('featureSection.title')}
                  description={t('featureSection.description')}
                />

                <div className='mt-10 grid gap-4'>
                  {featureCards.map((item) => (
                    <FeatureCard
                      key={item.step}
                      title={item.title}
                      description={item.description}
                      stat={item.stat}
                      Icon={item.Icon}
                    />
                  ))}
                </div>
              </div>

              <div className='relative'>
                <div className='rounded-4xl border border-primary-200 bg-white p-6 shadow-[0_40px_110px_-65px_rgba(160,99,196,0.85)] sm:p-8'>
                  <p className='text-sm font-medium uppercase tracking-[0.2em] text-primary-700'>
                    {t('featureSection.calculator.label')}
                  </p>
                  <h3 className='mt-4 text-3xl font-semibold tracking-[-0.05em] text-black sm:text-4xl'>
                    {t('featureSection.calculator.title')}
                  </h3>
                  <p className='mt-3 text-base leading-7 text-gray-600'>
                    {t('featureSection.calculator.description')}
                  </p>

                  <div className='mt-8 rounded-[1.75rem] bg-primary-50 p-6'>
                    <p className='text-sm font-medium uppercase tracking-[0.18em] text-primary-800'>
                      {t('featureSection.calculator.valueLabel')}
                    </p>
                    <p className='mt-3 text-4xl font-bold tracking-[-0.06em] text-black sm:text-[3.75rem]'>
                      {t('featureSection.calculator.amount')}
                    </p>
                    <p className='mt-3 text-sm leading-6 text-gray-600'>
                      {t('featureSection.calculator.caption')}
                    </p>
                  </div>

                  <div className='mt-6 space-y-3'>
                    {roiStats.map((item) => (
                      <div
                        key={item.label}
                        className='flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3'
                      >
                        <span className='text-sm text-gray-600'>{item.label}</span>
                        <span className='text-sm font-semibold text-black'>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='reviews' className='scroll-mt-28'>
          <div className='container mx-auto px-5 py-16 lg:px-8 lg:py-24'>
            <div className='grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center'>
              <div className='overflow-hidden'>
                <div
                  className='flex transition-transform duration-500 ease-out'
                  style={{
                    width: `${reviewSlides.length * 100}%`,
                    transform: `translateX(-${activeReviewSlide * (100 / reviewSlides.length)}%)`,
                  }}
                >
                  {reviewSlides.map((slide) => (
                    <div
                      key={`${slide.author}-image`}
                      className='w-full shrink-0'
                      style={{ width: `${100 / reviewSlides.length}%` }}
                    >
                      <TestimonialSpotlight
                        badge={t('testimonial.badge')}
                        imageSrc={slide.imageSrc}
                        imageAlt={slide.imageAlt}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className='max-w-2xl overflow-hidden'>
                <div
                  className='flex transition-transform duration-500 ease-out'
                  style={{
                    width: `${reviewSlides.length * 100}%`,
                    transform: `translateX(-${activeReviewSlide * (100 / reviewSlides.length)}%)`,
                  }}
                >
                  {reviewSlides.map((slide) => (
                    <div
                      key={`${slide.author}-content`}
                      className='w-full shrink-0'
                      style={{ width: `${100 / reviewSlides.length}%` }}
                    >
                      <div className='text-xl tracking-[0.25em] text-primary-500'>{'★★★★★'}</div>
                      <blockquote className='mt-6 font-montserrat text-2xl font-medium leading-normal tracking-[-0.02em] text-black sm:text-[2rem]'>
                        {slide.quote}
                      </blockquote>
                      <div className='mt-8 flex flex-col gap-4 text-base text-gray-600 sm:flex-row sm:items-center'>
                        <div>
                          <p className='font-semibold text-black'>{slide.author}</p>
                          <p>{slide.role}</p>
                        </div>
                        <div className='hidden h-12 w-px bg-gray-200 sm:block' />
                        <p className='text-sm uppercase tracking-[0.24em] text-gray-500'>
                          {slide.company}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-8 flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    {reviewSlides.map((slide, index) => (
                      <button
                        key={slide.author}
                        type='button'
                        aria-label={`Go to review ${index + 1}`}
                        onClick={() => setActiveReviewSlide(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          index === activeReviewSlide
                            ? 'w-8 bg-black'
                            : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  <div className='flex items-center gap-3'>
                    <button
                      type='button'
                      onClick={goToPreviousReview}
                      aria-label='Previous review'
                      className='inline-flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:text-black'
                    >
                      <ArrowBackIcon className='size-4 fill-current' />
                    </button>
                    <button
                      type='button'
                      onClick={goToNextReview}
                      aria-label='Next review'
                      className='inline-flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:text-black'
                    >
                      <ArrowForwardIcon className='size-4 fill-current' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id='pricing' className='scroll-mt-28'>
          <div className='container mx-auto px-5 py-16 lg:px-8 lg:py-24'>
            <div className='flex flex-col gap-10'>
              <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
                <SectionTitle title={t('pricing.title')} description={t('pricing.description')} />
                <div className='inline-flex w-fit items-center rounded-full border border-primary-300 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700'>
                  {t('pricing.badge')}
                </div>
              </div>

              <div className='grid gap-6 xl:grid-cols-3'>
                {pricingPlans.map((plan) => (
                  <PricingCard
                    key={plan.title}
                    title={plan.title}
                    subtitle={plan.subtitle}
                    price={plan.price}
                    suffix={plan.suffix}
                    features={plan.features}
                    ctaLabel={t('pricing.cta')}
                    onClick={scrollToCreateProfileButton}
                    featured={plan.featured}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id='create-profile' className='scroll-mt-28'>
          <div className='container mx-auto px-5 py-16 lg:px-8 lg:py-24'>
            <div className='mx-auto max-w-5xl rounded-4xl bg-white px-4 py-12 sm:px-10 lg:px-16 lg:py-16'>
              <SectionTitle
                align='center'
                title={t('signup.title')}
                description={t('signup.description')}
              />

              <form className='mx-auto mt-16 max-w-3xl lg:mt-20' onSubmit={handleSignupSubmit}>
                <div className='grid gap-6'>
                  <label className='block'>
                    <span className='mb-2 block text-sm text-gray-700'>{t('signup.fullName')}</span>
                    <FormInput
                      {...registerSignupField('name')}
                      classNames={landingFieldClassNames}
                      error={signupErrors.name?.message}
                    />
                  </label>

                  <label className='block'>
                    <span className='mb-2 block text-sm text-gray-700'>{t('signup.email')}</span>
                    <FormInput
                      {...registerSignupField('email')}
                      type='email'
                      classNames={landingFieldClassNames}
                      error={signupErrors.email?.message}
                    />
                  </label>

                  <label className='block'>
                    <span className='mb-2 block text-sm text-gray-700'>{t('signup.password')}</span>
                    <FormInput
                      {...registerSignupField('password')}
                      type={isShowPassword ? 'text' : 'password'}
                      classNames={landingFieldClassNames}
                      error={signupErrors.password?.message}
                      accessory={
                        <ShowPasswordToggler
                          value={isShowPassword}
                          toggle={() => setIsShowPassword((current) => !current)}
                        />
                      }
                    />
                  </label>

                  <label className='block'>
                    <span className='mb-2 block text-sm text-gray-700'>
                      {t('signup.confirmPassword')}
                    </span>
                    <FormInput
                      {...registerSignupField('confirmPassword')}
                      type={isShowConfirmPassword ? 'text' : 'password'}
                      classNames={landingFieldClassNames}
                      error={signupErrors.confirmPassword?.message}
                      accessory={
                        <ShowPasswordToggler
                          value={isShowConfirmPassword}
                          toggle={() => setIsShowConfirmPassword((current) => !current)}
                        />
                      }
                    />
                  </label>
                </div>

                <label className='mt-8 flex items-center gap-3 text-sm text-gray-700 lg:mt-10'>
                  <input
                    {...registerSignupField('agreeToTerms')}
                    type='checkbox'
                    className='size-[18px] rounded border border-gray-300 text-primary-600 focus:ring-primary-500'
                  />
                  <span>{t('signup.terms')}</span>
                </label>
                {signupErrors.agreeToTerms ? (
                  <p className='mt-1 text-sm text-red-500'>{signupErrors.agreeToTerms.message}</p>
                ) : null}

                <button
                  type='submit'
                  disabled={isPending}
                  className='mt-10 inline-flex h-12 w-full items-center justify-center rounded-lg border border-black bg-black px-6 text-sm font-medium text-white whitespace-nowrap transition-colors duration-300 hover:border-primary-500 hover:bg-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-70 lg:mt-12'
                >
                  {t('signup.cta')}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className='relative overflow-hidden'>
          <img
            alt=''
            src={decorImage.src}
            className='absolute inset-0 h-full w-full object-cover brightness-[1.03]'
          />
          <div className='absolute inset-0 bg-black/30'></div>
          <div className='relative container mx-auto px-5 py-16 lg:px-8 lg:py-24'>
            <div className='px-6 py-16 text-center sm:px-10 lg:-translate-y-20 lg:py-20'>
              <div className='mx-auto max-w-5xl'>
                <h2 className='font-montserrat text-balance text-[2rem] font-bold uppercase tracking-[0.12em] text-fuchsia-50 sm:text-[2.7rem]'>
                  {t('decor.title')}
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section id='faq' className='scroll-mt-28'>
          <div className='container mx-auto px-5 py-16 lg:px-8 lg:py-24'>
            <SectionTitle
              align='center'
              title={t('faq.title')}
              description={t('faq.description')}
            />

            <div className='mx-auto mt-12 max-w-3xl'>
              {faqEntries.map((item, index) => (
                <FaqItem
                  key={item.question}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFaqs.includes(index)}
                  onToggle={() => toggleFaq(index)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t border-gray-200'>
        <div className='container mx-auto px-5 py-10 lg:px-8'>
          <div className='flex flex-col gap-6'>
            <LogoMark />
            <div className='flex flex-col gap-6 border-t border-gray-200 pt-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between'>
              <div className='flex flex-wrap gap-6'>
                <a href='#' className='underline underline-offset-4'>
                  {t('footer.privacy')}
                </a>
                <a href='#' className='underline underline-offset-4'>
                  {t('footer.terms')}
                </a>
                <a href='#' className='underline underline-offset-4'>
                  {t('footer.cookies')}
                </a>
              </div>
              <p>
                © {new Date().getFullYear()} Avoo. {t('footer.rights')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
