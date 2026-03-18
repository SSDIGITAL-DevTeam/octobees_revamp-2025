declare module 'plyr' {
  interface PlyrOptions {
    controls?: string[];
    ratio?: string;
    youtube?: {
      noCookie?: boolean;
      rel?: number;
      showinfo?: number;
      iv_load_policy?: number;
      modestbranding?: number;
    };
    [key: string]: any;
  }

  class Plyr {
    constructor(element: any, options?: PlyrOptions);
    play(): void;
    pause(): void;
    destroy(): void;
    on(event: string, callback: (event: any) => void): void;
    once(event: string, callback: (event: any) => void): void;
    supported(provider: string, feature: string): boolean;
  }

  export default Plyr;
}

declare module 'plyr/dist/plyr.css';
